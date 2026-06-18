import snmp from "net-snmp";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { exec } from "child_process";
import util from "util";

const prisma = new PrismaClient();
const execPromise = util.promisify(exec);

async function pingIp(ip) {
    try {
        const cmd = process.platform === "win32" 
            ? `ping -n 2 -w 2000 ${ip}` 
            : `ping -c 2 -W 2 ${ip}`;
        await execPromise(cmd);
        return true;
    } catch (err) {
        return false;
    }
}

// Configurações
const TRAP_PORT = 162;
const API_URL = "http://127.0.0.1:3005/api/traps";
const SNMP_API_BASE = "http://127.0.0.1:3005/api/admin/devices";
const SYNC_SECRET = "ricas-sync-secret-token-2026";

// Timing de polling
const POLLING_INTERVAL_MS = 5 * 60 * 1000;  // 5 minutos (contato de 5 em 5 min)
const RETRY_DELAY_MS = 5 * 60 * 1000;        // 5 minutos entre retentativas
const MAX_RETRIES = 10;                       // 10 retentativas * 5 min = 50 min total antes de OFFLINE

// Controle de estado em memoria para evitar loops concorrentes
const retryingDevices = new Set();
let isPollingActive = false;

console.log("-----------------------------------------");
console.log("🚀 INICIANDO RECEPTOR DE TRAPS (UDP 162)");
console.log("-----------------------------------------");

const options = {
    port: TRAP_PORT,
    disableAuthorization: true,
    includeAuthentication: false
};

// Mapeia os tipos numéricos do net-snmp para strings legíveis que o trapParser.ts espera
// Referência: https://github.com/markabrahams/node-net-snmp/blob/master/lib/net-snmp.js
function snmpTypeToString(typeCode) {
    const types = {
        2:  'Integer',       // Integer32
        4:  'String',        // OctetString
        5:  'Null',          // Null
        6:  'OID',           // ObjectIdentifier
        64: 'IpAddress',     // IpAddress
        65: 'Counter',       // Counter32
        66: 'Gauge',         // Gauge32
        67: 'TimeTicks',     // TimeTicks
        68: 'Opaque',        // Opaque
        70: 'Counter64',     // Counter64
        128: 'NoSuchObject', // noSuchObject
        129: 'NoSuchInstance', // noSuchInstance
        130: 'EndOfMibView', // endOfMibView
    };
    return types[typeCode] || `Type${typeCode}`;
}

const callback = async function (error, trap) {
    if (error) {
        console.error("[ERRO]", error);
    } else {
        try {
            // Extrair o IP de origem
            const senderIp = trap.rinfo.address;
            console.log(`\n[TRAP RECEBIDA] De: ${senderIp}`);

            // Montar o texto da Trap no formato compatível com o trapParser.ts
            // Formato: "OID = TipoLegível: valor"
            // Exemplo: "1.3.6.1.4.1.15921.60.1.1.4 = String: AA2470138626"
            let trapText = `ZBXTRAP ${senderIp}\n`;
            
            for (let i = 0; i < trap.pdu.varbinds.length; i++) {
                const vb = trap.pdu.varbinds[i];
                let value = Buffer.isBuffer(vb.value) ? vb.value.toString() : vb.value;
                // Converte tipo numérico para string legível (ex: 4 → "String")
                const typeName = snmpTypeToString(vb.type);
                trapText += `${vb.oid} = ${typeName}: ${value}\n`;
            }

            console.log("--- Texto montado para API ---");
            console.log(trapText);
            console.log("-------------------------------");

            const response = await axios.post(API_URL, { trapText });
            
            if (response.data.success) {
                console.log(`✅ Trap processada e salva. Mensagem: ${response.data.message || 'OK'}`);
            } else {
                console.warn(`⚠️ API recebeu, mas não salvou: ${response.data.error}`);
            }

        } catch (err) {
            console.error("[ERRO AO PROCESSAR TRAP]");
            console.error("Mensagem:", err.message || err);
            if (err.response) {
                console.error("Status da API:", err.response.status);
                console.error("Resposta da API:", JSON.stringify(err.response.data));
            }
            console.log("Conteúdo do PDU:", JSON.stringify(trap.pdu?.varbinds?.slice(0,5), null, 2));
        }
    }
};

try {
    const receiver = snmp.createReceiver(options, callback);
    receiver.on("error", (e) => {
        if (e.code === 'EACCES') {
            console.error("❌ ERRO DE PERMISSÃO (Assíncrono): A porta 162 é restrita (precisa de root ou authbind).");
        } else if (e.code === 'EADDRINUSE') {
            console.error("❌ PORTA EM USO (Assíncrono): Outro processo já está usando a porta 162.");
        } else {
            console.error("❌ ERRO NO RECEIVER (Assíncrono):", e.message);
        }
        process.exit(1);
    });
    console.log(`✅ Ouvindo Traps na porta ${TRAP_PORT}...`);
    console.log(`📢 Aguardando equipamentos...`);
    console.log("-----------------------------------------");
} catch (e) {
    if (e.code === 'EACCES') {
        console.error("❌ ERRO DE PERMISSÃO: A porta 162 é restrita (precisa de root ou authbind).");
        console.error("👉 Execute: sudo bash fix-traps-completo.sh");
    } else if (e.code === 'EADDRINUSE') {
        console.error("❌ PORTA EM USO: Outro processo já está usando a porta 162.");
        console.error("👉 Verifique: sudo lsof -i UDP:162");
    } else {
        console.error("❌ ERRO AO INICIAR RECEIVER:", e.message);
    }
    // CRÍTICO: encerrar o processo para que o PM2 saiba que falhou
    // e possa registrar o erro corretamente (sem isso, PM2 mostra 'online' mas nada escuta)
    process.exit(1);
}

// --- HELPER: aguardar N milissegundos ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- SINCRONISMO SNMP DE UM DISPOSITIVO via HTTP Interno ---
async function syncDevice(device) {
    try {
        await axios.get(`${SNMP_API_BASE}/${device.id}/snmp?force=true`, {
            headers: { 'x-sync-secret': SYNC_SECRET },
            timeout: 30000  // 30s de timeout para o SNMP não travar
        });
        return true; // Sucesso
    } catch (err) {
        const errMsg = err.response?.data?.error || err.message || "Falha de conexão";
        console.log(`[SYNC] ❌ ${device.name} (${device.ip}) — Falha: ${errMsg}`);
        return false; // Falha
    }
}

// --- LOOP PRINCIPAL DE POLLING COM RETENTATIVAS ---
async function pollAllDevices() {
    if (isPollingActive) {
        console.log("[POLLING] ⚠️ Um ciclo de polling já está ativo. Pulando este ciclo para evitar sobreposição.");
        return;
    }
    isPollingActive = true;

    try {
        let devices = [];
        try {
            devices = await prisma.device.findMany({ 
                where: { active: true },
                select: { id: true, name: true, ip: true, status: true } 
            });
        } catch (err) {
            console.error("[POLLING] Erro ao buscar dispositivos do banco:", err.message);
            return;
        }

        console.log(`\n[POLLING] ▶ Iniciando ciclo de sincronismo para ${devices.length} dispositivos...`);

        for (const device of devices) {
            if (!device.ip) continue;

            console.log(`\n[SYNC] → ${device.name} (${device.ip})`);

            // Tentativa inicial
            const success = await syncDevice(device);

            if (success) {
                console.log(`[SYNC] ✅ ${device.name} sincronizado com sucesso (ONLINE)`);
                continue; // Próximo dispositivo
            }

            // Se o device já estiver OFFLINE, a gente não inicia ciclo de retentativas de 50 min
            // (ele já falhou as retentativas antes, e continuará sendo testado a cada 5 min no polling normal)
            if (device.status === "OFFLINE") {
                console.log(`[SYNC] ❌ ${device.name} continua OFFLINE.`);
                continue;
            }

            // Se já está num ciclo de retentativas, não inicie outro paralelo
            if (retryingDevices.has(device.id)) {
                console.log(`[SYNC] ⏳ ${device.name} já está em ciclo de retentativas (aguardando 50 min)...`);
                continue;
            }

            retryingDevices.add(device.id);

            // Se falhou na tentativa inicial, já foi marcado ALERTA pela API.
            // Inicia as retentativas em background para não bloquear outros dispositivos.
            (async () => {
                let recovered = false;
                for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                    console.log(`[RETRY] ⏳ ${device.name} — Aguardando ${RETRY_DELAY_MS / 60000} min antes da retentativa ${attempt}/${MAX_RETRIES}...`);
                    await sleep(RETRY_DELAY_MS);

                    console.log(`[RETRY] 🔄 ${device.name} — Retentativa ${attempt}/${MAX_RETRIES}...`);
                    const retrySuccess = await syncDevice(device);

                    if (retrySuccess) {
                        console.log(`[RETRY] ✅ ${device.name} recuperado na tentativa ${attempt} — Status: ONLINE`);
                        recovered = true;
                        break;
                    }
                }

                if (!recovered) {
                    // Antes de decretar OFFLINE e mandar alertas, vamos realizar um PING ICMP para testar o link de rede.
                    console.log(`[RETRY] 🔍 ${device.name} (${device.ip}) falhou no SNMP. Testando conectividade física via ICMP Ping...`);
                    const isPingable = await pingIp(device.ip);

                    if (isPingable) {
                        // O equipamento responde ao ping, logo o link 4G/rede está online, mas o SNMP falhou.
                        // Evitamos mandar alerta de OFFLINE e marcar como OFFLINE (mantemos em ALERTA).
                        console.log(`[RETRY] 📶 ${device.name} (${device.ip}) respondeu ao PING! Mantendo em status ALERTA para evitar falso positivo.`);
                        try {
                            await prisma.device.update({
                                where: { id: device.id },
                                data: {
                                    status: "ALERTA",
                                    syncError: `Falha na telemetria (SNMP inalcançável), mas o link de rede responde ao PING.`
                                }
                            });
                        } catch (dbErr) {
                            console.error(`[RETRY] Erro ao atualizar status ALERTA no banco: ${dbErr.message}`);
                        }
                    } else {
                        // Ambos falharam (SNMP e PING): agora sim é um offline verdadeiro!
                        console.log(`[RETRY] ❌ ${device.name} — SNMP e PING falharam. Mudando status para: OFFLINE`);
                        try {
                            await prisma.device.update({
                                where: { id: device.id },
                                data: {
                                    status: "OFFLINE",
                                    syncError: `Equipamento Offline — Retentativas SNMP e PING de rede falharam.`
                                }
                            });

                            // Dispara as notificações via Next.js
                            console.log(`[RETRY] 📣 Disparando alertas de e-mail e WhatsApp para ${device.name} OFFLINE...`);
                            await axios.post(`${SNMP_API_BASE}/${device.id}/offline-notification`, {}, {
                                headers: { 'x-sync-secret': SYNC_SECRET },
                                timeout: 15000
                            }).catch(err => console.error(`[RETRY] Erro ao disparar notificação offline via HTTP: ${err.message}`));

                        } catch (dbErr) {
                            console.error(`[RETRY] Erro ao atualizar status OFFLINE no banco: ${dbErr.message}`);
                        }
                    }
                }

                // Fim do ciclo de retentativas
                retryingDevices.delete(device.id);
            })();
        }

        try {
            await checkVpnTunnels();
        } catch (vpnErr) {
            console.error("[VPN] Erro inesperado ao checar VPN:", vpnErr.message);
        }

        console.log(`\n[POLLING] ✔ Ciclo concluído. Próximo em ${POLLING_INTERVAL_MS / 60000} minutos.`);
    } finally {
        isPollingActive = false;
    }
}

// --- MONITORAMENTO DE TÚNEIS VPN SSTP VIA MIKROTIK CENTRAL ---
const SSTP_SERVER_IP = process.env.SSTP_SERVER_IP || "192.168.67.254";
const SSTP_SERVER_COMMUNITY = process.env.SSTP_SERVER_COMMUNITY || "ricas";

async function checkVpnTunnels() {
    console.log(`\n[VPN] 🔍 Verificando túneis SSTP no Mikrotik Central (${SSTP_SERVER_IP})...`);
    
    let devices = [];
    try {
        devices = await prisma.device.findMany({
            where: { 
                active: true,
                vpnUsername: { not: null }
            }
        });
    } catch (dbErr) {
        console.error("[VPN] Erro ao buscar dispositivos para monitoramento VPN:", dbErr.message);
        return;
    }

    if (devices.length === 0) {
        console.log("[VPN] Nenhum dispositivo com 'vpnUsername' configurado para monitoramento.");
        return;
    }

    console.log(`[VPN] Encontrados ${devices.length} dispositivos com túneis configurados.`);

    const communities = [SSTP_SERVER_COMMUNITY, "ricas", "Ricas", "RICAS", "public"];
    const uniqueCommunities = [...new Set(communities)];

    let success = false;
    for (const community of uniqueCommunities) {
        console.log(`[VPN] Tentando conectar no Mikrotik Central com a comunidade '${community}'...`);
        const session = snmp.createSession(SSTP_SERVER_IP, community, {
            port: 161,
            retries: 1,
            timeout: 3000,
            version: snmp.Version2c
        });

        try {
            // Testar se responde com sysName OID
            await new Promise((resolve, reject) => {
                session.get(["1.3.6.1.2.1.1.5.0"], (err, vbs) => {
                    if (err) reject(err);
                    else resolve(vbs);
                });
            });

            console.log(`[VPN] ✅ Conectado com sucesso ao Mikrotik Central usando a comunidade '${community}'!`);

            // 1. Walk nos nomes das interfaces (ifDescr OID: 1.3.6.1.2.1.2.2.1.2)
            const nameWalk = await new Promise((resolve, reject) => {
                const results = [];
                session.subtree("1.3.6.1.2.1.2.2.1.2", 20, (vbs) => {
                    for (const vb of vbs) {
                        results.push({ oid: vb.oid, value: vb.value ? vb.value.toString() : "" });
                    }
                }, (error) => error ? reject(error) : resolve(results));
            });

            // 2. Walk nos status operacionais (ifOperStatus OID: 1.3.6.1.2.1.2.2.1.8)
            const statusWalk = await new Promise((resolve, reject) => {
                const results = [];
                session.subtree("1.3.6.1.2.1.2.2.1.8", 20, (vbs) => {
                    for (const vb of vbs) {
                        results.push({ oid: vb.oid, value: vb.value ? parseInt(vb.value.toString()) : 2 });
                    }
                }, (error) => error ? reject(error) : resolve(results));
            });

            // 3. Walk no mapeamento IP -> Interface (ipAdEntIfIndex OID: 1.3.6.1.2.1.4.20.1.2)
            const ipWalk = await new Promise((resolve, reject) => {
                const results = [];
                session.subtree("1.3.6.1.2.1.4.20.1.2", 20, (vbs) => {
                    for (const vb of vbs) {
                        const parts = vb.oid.split('.');
                        const ipAddr = parts.slice(-4).join('.');
                        results.push({ ip: ipAddr, ifIndex: parseInt(vb.value.toString()) });
                    }
                }, (error) => error ? reject(error) : resolve(results));
            });

            // Agrupar interfaces
            const interfaces = {};
            for (const item of nameWalk) {
                const index = item.oid.split('.').pop();
                interfaces[index] = { index, name: item.value, status: 2, ip: null };
            }

            for (const item of statusWalk) {
                const index = item.oid.split('.').pop();
                if (interfaces[index]) {
                    interfaces[index].status = item.value;
                }
            }

            for (const item of ipWalk) {
                const index = item.ifIndex.toString();
                if (interfaces[index]) {
                    interfaces[index].ip = item.ip;
                }
            }

            // 4. Comparar cada dispositivo com as interfaces ativas
            for (const device of devices) {
                const vpnUser = device.vpnUsername.toLowerCase().trim();
                
                // Procura interface que bata com o usuário do SSTP
                const matchedIf = Object.values(interfaces).find(i => {
                    const ifName = i.name.toLowerCase();
                    return ifName === vpnUser || 
                           ifName === `<sstp-${vpnUser}>` || 
                           ifName.includes(`sstp-${vpnUser}`) || 
                           ifName === `sstp-${vpnUser}` ||
                           ifName.includes(vpnUser);
                });

                if (matchedIf && matchedIf.status === 1) {
                    // Túnel ativo!
                    console.log(`[VPN] ✅ Túnel de ${device.name} (${device.vpnUsername}) está ATIVO! IP: ${matchedIf.ip || "Não mapeado"}`);
                    await prisma.device.update({
                        where: { id: device.id },
                        data: {
                            vpnStatus: "ONLINE",
                            vpnIp: matchedIf.ip || null,
                            vpnLastSeen: new Date()
                        }
                    });
                } else {
                    // Túnel inativo!
                    console.log(`[VPN] ❌ Túnel de ${device.name} (${device.vpnUsername}) está INATIVO!`);
                    await prisma.device.update({
                        where: { id: device.id },
                        data: {
                            vpnStatus: "OFFLINE",
                            vpnIp: null
                        }
                    });
                }
            }

            success = true;
            session.close();
            break; // Comunidade funcionou, parar loops
        } catch (snmpErr) {
            console.error(`[VPN] ⚠️ Comunidade '${community}' falhou ao ler Mikrotik Central:`, snmpErr.message);
            session.close();
        }
    }

    if (!success) {
        console.error(`[VPN] ❌ Não foi possível obter dados do Mikrotik Central (${SSTP_SERVER_IP}) usando nenhuma das comunidades disponíveis (public/ricas).`);
    }
}

// --- INICIALIZAÇÃO: dispara imediatamente e agenda ciclos de 7 min ---
console.log(`\n⏱️  Sistema de Polling SNMP inicializado.`);
console.log(`   → Ciclo principal: ${POLLING_INTERVAL_MS / 60000} minutos`);
console.log(`   → Retentativas: ${MAX_RETRIES}x com ${RETRY_DELAY_MS / 60000} min de intervalo`);
console.log(`   → Método: HTTP interno (token secreto)\n`);

pollAllDevices();
setInterval(pollAllDevices, POLLING_INTERVAL_MS);
