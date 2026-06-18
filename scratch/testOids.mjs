import snmp from 'net-snmp';

const ip = '192.170.115.101';
const community = 'ricas';

const session = snmp.createSession(ip, community, { version: snmp.Version2c });

const oids = [
  '1.3.6.1.4.1.15921.60.2.30.1.1.220.1.0',
  '1.3.6.1.4.1.15921.60.2.30.1.1.221.1.0',
  '1.3.6.1.4.1.15921.60.2.30.1.1.221.3.0',
];

session.get(oids, (error, varbinds) => {
  if (error) {
    console.error('GET Error:', error.message);
    // Try one by one
    oids.forEach(oid => {
      session.get([oid], (err, vbs) => {
        if (err) {
          console.error(`Error for ${oid}:`, err.message);
        } else {
          console.log(`Success for ${oid}:`, vbs[0].value.toString(), 'Type:', vbs[0].type);
        }
      });
    });
  } else {
    varbinds.forEach(vb => {
      console.log(vb.oid, '=', vb.value.toString(), 'Type:', vb.type);
    });
  }
});
