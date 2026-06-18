import snmp from 'net-snmp';

const ip = '192.170.115.101';
const community = 'ricas';

const session = snmp.createSession(ip, community, { version: snmp.Version2c });

const searchValues = ['22.00', '220', '22', '-5.00', '-5', '-500', '73.4', '73', '734'];

console.log('Iniciando WALK...');
session.walk('1.3.6.1.4.1.15921.60', 10, (snmpbinds) => {
  for (let i = 0; i < snmpbinds.length; i++) {
    const vb = snmpbinds[i];
    let valStr = '';
    if (Buffer.isBuffer(vb.value)) {
      valStr = vb.value.toString();
    } else if (vb.value !== null) {
      valStr = vb.value.toString();
    }
    
    if (searchValues.some(v => valStr.includes(v))) {
      console.log(`Encontrado! OID: ${vb.oid} = ${valStr}`);
    }
  }
}, (error) => {
  if (error) {
    console.error('Walk Error:', error.message);
  } else {
    console.log('Walk finished.');
  }
  session.close();
});
