import snmp from 'net-snmp';
import fs from 'fs';

const ip = '192.170.115.101'; // Let's test this one second
const community = 'ricas';

const session = snmp.createSession(ip, community, { version: snmp.Version2c });

console.log('Iniciando WALK total...');
const outStream = fs.createWriteStream('scratch/snmp_dump_115.txt');

session.walk('1.3.6.1.4.1.15921.60', 20, (snmpbinds) => {
  for (let i = 0; i < snmpbinds.length; i++) {
    const vb = snmpbinds[i];
    let valStr = '';
    if (Buffer.isBuffer(vb.value)) {
      valStr = vb.value.toString();
    } else if (vb.value !== null) {
      valStr = vb.value.toString();
    }
    outStream.write(`${vb.oid} = ${valStr}\n`);
  }
}, (error) => {
  if (error) {
    console.error('Walk Error:', error.message);
  } else {
    console.log('Walk finished.');
  }
  outStream.end();
  session.close();
});
