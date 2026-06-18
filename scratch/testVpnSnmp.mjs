import snmp from 'net-snmp';

const SSTP_SERVER_IP = "192.168.67.254";
const communities = ["public", "ricas"];

console.log(`[DIAGNOSTIC] 🔍 Iniciando teste de SNMP no Mikrotik Central (${SSTP_SERVER_IP})...`);

async function run() {
    let success = false;
    for (const community of communities) {
        console.log(`\n[DIAGNOSTIC] Tentando conectar usando a comunidade '${community}'...`);
        const session = snmp.createSession(SSTP_SERVER_IP, community, {
            port: 161,
            retries: 1,
            timeout: 3000,
            version: snmp.Version2c
        });

        try {
            // Testar se responde com sysName OID
            const sysName = await new Promise((resolve, reject) => {
                session.get(["1.3.6.1.2.1.1.5.0"], (err, vbs) => {
                    if (err) reject(err);
                    else resolve(vbs[0].value.toString());
                });
            });

            console.log(`[DIAGNOSTIC] ✅ Conectado ao Mikrotik Central! Nome do Equipamento: "${sysName}"`);
            success = true;

            // 1. Walk nos nomes das interfaces (ifDescr OID: 1.3.6.1.2.1.2.2.1.2)
            console.log("[DIAGNOSTIC] Fazendo SNMP Walk nas interfaces (ifDescr)...");
            const nameWalk = await new Promise((resolve, reject) => {
                const results = [];
                session.walk("1.3.6.1.2.1.2.2.1.2", 100, (vbs) => {
                    for (const vb of vbs) {
                        results.push({ oid: vb.oid, value: vb.value ? vb.value.toString() : "" });
                    }
                }, (error) => error ? reject(error) : resolve(results));
            });

            // 2. Walk nos status operacionais (ifOperStatus OID: 1.3.6.1.2.1.2.2.1.8)
            console.log("[DIAGNOSTIC] Fazendo SNMP Walk no status das interfaces (ifOperStatus)...");
            const statusWalk = await new Promise((resolve, reject) => {
                const results = [];
                session.walk("1.3.6.1.2.1.2.2.1.8", 100, (vbs) => {
                    for (const vb of vbs) {
                        results.push({ oid: vb.oid, value: vb.value ? parseInt(vb.value.toString()) : 2 });
                    }
                }, (error) => error ? reject(error) : resolve(results));
            });

            // Agrupar interfaces
            const interfaces = {};
            for (const item of nameWalk) {
                const index = item.oid.split('.').pop();
                interfaces[index] = { index, name: item.value, status: 2 };
            }

            for (const item of statusWalk) {
                const index = item.oid.split('.').pop();
                if (interfaces[index]) {
                    interfaces[index].status = item.value;
                }
            }

            console.log("\n[DIAGNOSTIC] === LISTA DE TODAS AS INTERFACES ENCONTRADAS ===");
            console.log("Índice\t| Status\t| Nome da Interface");
            console.log("------------------------------------------------------------");
            for (const i of Object.values(interfaces)) {
                // Filtrar para mostrar principalmente SSTP ou PPP para não poluir o terminal, ou mostrar tudo
                const statusStr = i.status === 1 ? "ONLINE (1)" : "OFFLINE (2)";
                if (i.name.toLowerCase().includes("sstp") || i.name.toLowerCase().includes("fasano") || i.status === 1) {
                    console.log(`${i.index}\t| ${statusStr}\t| ${i.name}`);
                }
            }
            console.log("============================================================");

            session.close();
            break;
        } catch (err) {
            console.error(`[DIAGNOSTIC] ❌ Falha com a comunidade '${community}':`, err.message);
            session.close();
        }
    }

    if (!success) {
        console.error("[DIAGNOSTIC] ❌ Não foi possível se conectar ao Mikrotik Central usando nenhuma comunidade.");
    }
}

run();
