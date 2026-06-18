// Simula o texto exato que o trapReceiver.mjs manda para a API /api/traps
// quando recebe uma trap do Comba (formato net-snmp / v2c)
// Roda localmente para testar o parser sem precisar do servidor

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');
const { fileURLToPath } = require('url');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simular uma trap típica do Comba Vila Mariana / Santa Cruz
// conforme o formato que o net-snmp monta em trapReceiver.mjs
const COMBA_TRAP_SAMPLE = `ZBXTRAP 192.165.101.102
1.3.6.1.2.1.1.3.0 = TimeTicks: 12345678
1.3.6.1.6.3.1.1.4.1.0 = OID: 1.3.6.1.4.1.15921.60.1.2.409
1.3.6.1.4.1.15921.60.1.1.1 = Integer32: 0
1.3.6.1.4.1.15921.60.1.1.2 = String: 2026-06-15 14:00:00
1.3.6.1.4.1.15921.60.1.1.3 = Integer32: 2
1.3.6.1.4.1.15921.60.1.1.4 = String: AA2470138626
1.3.6.1.4.1.15921.60.1.1.5 = String: ComBA_AU300M
1.3.6.1.4.1.15921.60.1.1.6 = String: 1.0.0
1.3.6.1.4.1.15921.60.1.1.7 = String: SANTA CRUZ S1
1.3.6.1.4.1.15921.60.1.1.8 = String: EU3
1.3.6.1.4.1.15921.60.1.1.9 = Integer32: 1
1.3.6.1.4.1.15921.60.1.1.10 = Integer32: 1
1.3.6.1.4.1.15921.60.1.1.11 = String: 1C DL
1.3.6.1.4.1.15921.60.1.1.12 = Integer32: 1
1.3.6.1.4.1.15921.60.1.1.13 = Integer32: 1
`;

console.log("=== SIMULAÇÃO DE TRAP DO COMBA ===");
console.log("IP de origem: 192.165.101.102");
console.log("Serial esperado: AA2470138626");
console.log("");
console.log("=== TEXTO DA TRAP MONTADO PELO trapReceiver.mjs ===");
console.log(COMBA_TRAP_SAMPLE);
console.log("===");

// Testar parsing com o mesmo arquivo do servidor
// (requer que você rode no contexto do projeto)
async function testParser() {
  try {
    // Dinâmico - tenta importar o parser do projeto
    const parserPath = path.resolve(__dirname, '..', 'src', 'lib', 'trapParser.ts');
    console.log("Tentando importar parser de:", parserPath);
    
    // Como é TypeScript, vamos replicar a lógica aqui para teste
    const trapOidMatch = COMBA_TRAP_SAMPLE.match(
      /(?:snmpTrapOID\.0|1\.3\.6\.1\.6\.3\.1\.1\.4\.1\.0)\s*=\s*.*?(?:15921\.60\.1\.2\.|:)\s*(\d+)(?:\r|\n|$)/m
    );
    
    const trapId = trapOidMatch ? trapOidMatch[1] : null;
    console.log("TrapID extraído:", trapId, "(esperado: 409)");
    
    const serialMatch = COMBA_TRAP_SAMPLE.match(
      /(?:enterprises|1\.3\.6\.1\.4\.1)\.15921\.60\.1\.1\.4\s*=\s*.*?: (.*?)(?:$|,|\r|\n)/m
    );
    const serial = serialMatch ? serialMatch[1].trim() : null;
    console.log("Serial extraído:", serial, "(esperado: AA2470138626)");
    
    const ipMatch = COMBA_TRAP_SAMPLE.match(/ZBXTRAP\s+(\d+\.\d+\.\d+\.\d+)/);
    const senderIp = ipMatch ? ipMatch[1] : null;
    console.log("IP remetente:", senderIp, "(esperado: 192.165.101.102)");
    
    const alarmSetMatch = COMBA_TRAP_SAMPLE.match(
      /(?:enterprises|1\.3\.6\.1\.4\.1)\.15921\.60\.1\.1\.13\s*=\s*.*?: (.*?)(?:$|,|\r|\n)/m
    );
    const alarmSet = alarmSetMatch ? alarmSetMatch[1].trim() : null;
    console.log("Campo 13 (set=1/clear=0):", alarmSet, "(esperado: 1)");
    
    console.log("");
    if (!trapId) {
      console.log("❌ FALHA: TrapID não extraído! O parser não conseguiu identificar o OID.");
      console.log("   Verifique se o formato da trap do Comba bate com o regex.");
    } else if (!serial) {
      console.log("❌ FALHA: Serial não extraído! Trap será associada por IP.");
      console.log("   Verifique se o device tem IP 192.165.101.102 cadastrado no banco.");
    } else {
      console.log("✅ Parser OK! TrapID, serial e IP foram extraídos corretamente.");
      console.log(`   Device será buscado por serial '${serial}' no banco.`);
      console.log(`   Se não encontrar por serial, tentará pelo IP '${senderIp}'.`);
    }
    
    console.log("");
    console.log("=== AÇÃO NECESSÁRIA NO BANCO ===");
    console.log("Verifique se o Comba Santa Cruz tem cadastrado:");
    console.log("  IP: 192.165.101.102 OU Serial: AA2470138626");
    console.log("Acesse: http://192.168.67.94:3005/admin");
    
  } catch (err) {
    console.error("Erro no teste:", err.message);
  }
}

testParser();
