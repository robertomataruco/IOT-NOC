import snmp from 'net-snmp';

const ip = '192.170.115.101';
const community = 'ricas';
const testOid = '.1.3.6.1.2.1.1.1.0'; // OID padrão de sistema (sysDescr)

function testVersion(version, label) {
  console.log(`\n--- Testando SNMP ${label} ---`);
  const session = snmp.createSession(ip, community, {
    version: version,
    timeout: 3000,
    retries: 0
  });

  session.get([testOid], (error, varbinds) => {
    if (error) {
      console.log(`❌ Falha no ${label}: ${error.message}`);
    } else {
      console.log(`✅ SUCESSO no ${label}!`);
      console.log(`Resposta: ${varbinds[0].value.toString()}`);
    }
    session.close();
  });
}

console.log(`Iniciando diagnóstico para ${ip}...`);
testVersion(snmp.Version1, 'v1');
testVersion(snmp.Version2c, 'v2c');
