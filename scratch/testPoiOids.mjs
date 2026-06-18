import snmp from 'net-snmp';

const ip = '192.170.114.101';
const community = 'ricas';

const session = snmp.createSession(ip, community, { version: snmp.Version2c });

// Expandindo a busca: sub-OIDs 22-35 e instâncias 1 e 2
const testOids = [];
for (let subOid = 22; subOid <= 35; subOid++) {
  testOids.push(`1.3.6.1.4.1.15921.60.2.10.1.1.${subOid}.1.0`);
  testOids.push(`1.3.6.1.4.1.15921.60.2.10.1.1.${subOid}.2.0`);
}

console.log('Consultando sub-OIDs 22-35 da tabela POI...\n');

const promises = testOids.map(oid => {
  return new Promise((resolve) => {
    session.get([oid], (err, vbs) => {
      if (err || !vbs || vbs.length === 0 || vbs[0].value === null) {
        resolve(null);
      } else {
        const vb = vbs[0];
        const val = Buffer.isBuffer(vb.value) ? vb.value.toString() : vb.value.toString();
        // Só mostrar se não for erro SNMP (NoSuchObject = type 128)
        if (vb.type !== 128 && vb.type !== 129) {
          resolve({ oid, value: val, type: vb.type });
        } else {
          resolve(null);
        }
      }
    });
  });
});

Promise.all(promises).then(results => {
  results.filter(r => r !== null).forEach(r => {
    console.log(`${r.oid} = [${r.type}] ${r.value}`);
  });
  session.close();
  console.log('\nConcluído.');
});
