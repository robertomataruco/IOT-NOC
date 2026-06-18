import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import snmp from 'net-snmp';

const prisma = new PrismaClient();

const SSTP_SERVER_IP = process.env.SSTP_SERVER_IP || "192.168.67.254";
const SSTP_SERVER_COMMUNITY = process.env.SSTP_SERVER_COMMUNITY || "ricas";

export async function POST() {
  console.log(`[API-DIAGNOSTIC] 🔍 Iniciando verificação manual de túneis SSTP...`);
  
  const report: {
    success: boolean;
    ip: string;
    connectedCommunity: string | null;
    interfacesFound: any[];
    devicesChecked: any[];
    error?: string;
    attempts?: any[];
  } = {
    success: false,
    ip: SSTP_SERVER_IP,
    connectedCommunity: null,
    interfacesFound: [],
    devicesChecked: [],
    attempts: []
  };

  let devices = [];
  try {
    devices = await prisma.device.findMany({
      where: { 
        active: true,
        vpnUsername: { not: null }
      }
    });
  } catch (dbErr: any) {
    return NextResponse.json({ success: false, error: `Erro no banco de dados: ${dbErr.message}` }, { status: 500 });
  }

  if (devices.length === 0) {
    return NextResponse.json({ 
      success: true, 
      message: "Nenhum dispositivo com 'vpnUsername' configurado para monitoramento.",
      report 
    });
  }

  const communities = [SSTP_SERVER_COMMUNITY, "ricas", "Ricas", "RICAS", "public"];
  const uniqueCommunities = Array.from(new Set(communities));

  let connectedCommunity: string | null = null;
  let interfaces: Record<string, any> = {};

  for (const community of uniqueCommunities) {
    console.log(`[API-DIAGNOSTIC] Testando conexão com comunidade '${community}'...`);
    const session = snmp.createSession(SSTP_SERVER_IP, community, {
      port: 161,
      retries: 1,
      timeout: 2500,
      version: snmp.Version2c
    });

    try {
      // Testar se responde com sysName
      await new Promise((resolve, reject) => {
        session.get(["1.3.6.1.2.1.1.5.0"], (err, vbs) => {
          if (err) reject(err);
          else resolve(vbs);
        });
      });

      connectedCommunity = community;
      report.connectedCommunity = community;
      report.attempts!.push({ community, status: "SUCCESS" });
      console.log(`[API-DIAGNOSTIC] ✅ Conectado com sucesso com '${community}'!`);

      // 1. Walk nos nomes das interfaces (ifDescr OID: 1.3.6.1.2.1.2.2.1.2)
      const nameWalk: any[] = await new Promise((resolve, reject) => {
        const results: any[] = [];
        session.subtree("1.3.6.1.2.1.2.2.1.2", 20, (vbs) => {
          for (const vb of vbs) {
            results.push({ oid: vb.oid, value: vb.value ? vb.value.toString() : "" });
          }
        }, (error) => error ? reject(error) : resolve(results));
      });

      // 2. Walk nos status operacionais (ifOperStatus OID: 1.3.6.1.2.1.2.2.1.8)
      const statusWalk: any[] = await new Promise((resolve, reject) => {
        const results: any[] = [];
        session.subtree("1.3.6.1.2.1.2.2.1.8", 20, (vbs) => {
          for (const vb of vbs) {
            results.push({ oid: vb.oid, value: vb.value ? parseInt(vb.value.toString()) : 2 });
          }
        }, (error) => error ? reject(error) : resolve(results));
      });

      // 3. Walk no mapeamento IP -> Interface (ipAdEntIfIndex OID: 1.3.6.1.2.1.4.20.1.2)
      const ipWalk: any[] = await new Promise((resolve, reject) => {
        const results: any[] = [];
        session.subtree("1.3.6.1.2.1.4.20.1.2", 20, (vbs) => {
          for (const vb of vbs) {
            const parts = vb.oid.split('.');
            const ipAddr = parts.slice(-4).join('.');
            results.push({ ip: ipAddr, ifIndex: parseInt(vb.value.toString()) });
          }
        }, (error) => error ? reject(error) : resolve(results));
      });

      // Agrupar interfaces
      for (const item of nameWalk) {
        const index = item.oid.split('.').pop()!;
        interfaces[index] = { index, name: item.value, status: 2, ip: null };
      }

      for (const item of statusWalk) {
        const index = item.oid.split('.').pop()!;
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

      const rawInterfacesList = Object.values(interfaces).map((i: any) => ({
        index: i.index,
        name: i.name,
        status: i.status === 1 ? "ONLINE (1)" : `OFFLINE (${i.status})`,
        ip: i.ip
      }));

      report.interfacesFound = Object.values(interfaces)
        .filter((i: any) => 
          i.status === 1 || 
          i.name.toLowerCase().includes("sstp") || 
          i.name.toLowerCase().includes("ppp") || 
          i.name.toLowerCase().includes("vpn") ||
          i.name.toLowerCase().includes("fasano")
        )
        .map(i => ({
          index: i.index,
          name: i.name,
          status: i.status === 1 ? "ONLINE (1)" : `OFFLINE (${i.status})`,
          ip: i.ip
        }));

      // Se a busca filtrada for vazia mas a crua tiver dados, enviamos os 10 primeiros para provar que a leitura funciona!
      (report as any).walkCounts = {
        namesCount: nameWalk.length,
        statusCount: statusWalk.length,
        ipsCount: ipWalk.length
      };

      if (report.interfacesFound.length === 0 && rawInterfacesList.length > 0) {
        (report as any).rawInterfacesFallback = rawInterfacesList.slice(0, 15);
      }

      session.close();
      break; // Sucesso, sai do loop de comunidades
    } catch (snmpErr: any) {
      console.error(`[API-DIAGNOSTIC] Falha na comunidade '${community}':`, snmpErr.message);
      report.attempts!.push({ community, status: "FAILED", error: snmpErr.message });
      session.close();
    }
  }

  if (!connectedCommunity) {
    report.success = false;
    report.error = "Não foi possível conectar ao Mikrotik Central usando nenhuma comunidade (ricas, public, etc.). Verifique se o SNMP está ativado no Mikrotik Central para responder ao IP do servidor.";
    return NextResponse.json(report, { status: 400 });
  }

  // 4. Comparar cada dispositivo cadastrado
  for (const device of devices) {
    const vpnUser = device.vpnUsername!.toLowerCase().trim();
    
    // Procura interface
    const matchedIf = Object.values(interfaces).find(i => {
      const ifName = i.name.toLowerCase();
      return ifName === vpnUser || 
             ifName === `<sstp-${vpnUser}>` || 
             ifName.includes(`sstp-${vpnUser}`) || 
             ifName === `sstp-${vpnUser}` ||
             ifName.includes(vpnUser);
    });

    const isOnline = matchedIf && matchedIf.status === 1;

    // Atualizar no banco em tempo real
    await prisma.device.update({
      where: { id: device.id },
      data: {
        vpnStatus: isOnline ? "ONLINE" : "OFFLINE",
        vpnIp: isOnline ? (matchedIf.ip || null) : null,
        vpnLastSeen: isOnline ? new Date() : device.vpnLastSeen
      }
    });

    report.devicesChecked.push({
      deviceId: device.id,
      deviceName: device.name,
      vpnUsernameConfigured: device.vpnUsername,
      evaluatedStatus: isOnline ? "ONLINE" : "OFFLINE",
      matchedInterfaceName: matchedIf ? matchedIf.name : "Nenhuma correspondente encontrada no Mikrotik",
      matchedInterfaceStatus: matchedIf ? (matchedIf.status === 1 ? "ONLINE (1)" : `OFFLINE (${matchedIf.status})`) : "N/A",
      matchedIp: matchedIf ? matchedIf.ip : null
    });
  }

  report.success = true;
  return NextResponse.json(report);
}
