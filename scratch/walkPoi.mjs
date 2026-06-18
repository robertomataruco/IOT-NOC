import snmp from 'net-snmp';

const ip = '192.170.115.101';
const community = 'ricas';

const session = snmp.createSession(ip, community, { version: snmp.Version2c });

console.log('Iniciando WALK na tabela POI (60.2.10)...');

session.walk('1.3.6.1.4.1.15921.60.2.10', 10, (snmpbinds) => {
  for (let i = 0; i < snmpbinds.length; i++) {
    const vb = snmpbinds[i];
    let valStr = '';
    if (Buffer.isBuffer(vb.value)) {
      valStr = vb.value.toString();
    } else if (vb.value !== null) {
      valStr = vb.value.toString();
    }
    console.log(`${vb.oid} = ${valStr}`);
  }
}, (error) => {
  if (error) {
    console.error('Walk Error:', error.message);
  } else {
    console.log('Walk finished.');
  }
  session.close();
});
