import snmp from 'net-snmp';

const ip = '192.170.114.101';
const community = 'ricas';

const session = snmp.createSession(ip, community, { version: snmp.Version2c });

// Testando possíveis OIDs de temperatura
// Temperatura na tabela POI (.60.2.10) - sub-OIDs menores
// Temperatura na tabela AU (.60.2.30) - OIDs que você originalmente passou
const testOids = [
  // Tabela POI - sub-OIDs que não foram testados ainda
  '1.3.6.1.4.1.15921.60.2.10.1.1.4.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.5.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.6.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.7.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.8.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.9.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.22.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.23.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.24.1.0',
  '1.3.6.1.4.1.15921.60.2.10.1.1.25.1.0',
  // Tabela AU (originalmente pedidos) - confirmando se não existem:
  '1.3.6.1.4.1.15921.60.2.30.1.1.220.1.0',
  '1.3.6.1.4.1.15921.60.2.30.1.1.220.3.0',
  // Tabela geral do controlador (DCU) - temperatura pode estar aqui
  '1.3.6.1.4.1.15921.60.2.1.8.0',
  '1.3.6.1.4.1.15921.60.2.1.9.0',
  '1.3.6.1.4.1.15921.60.2.1.10.0',
  '1.3.6.1.4.1.15921.60.2.1.11.0',
  '1.3.6.1.4.1.15921.60.2.1.12.0',
];

console.log('Procurando OIDs de Temperatura...\n');

const promises = testOids.map(oid => {
  return new Promise((resolve) => {
    session.get([oid], (err, vbs) => {
      if (err || !vbs || vbs.length === 0 || vbs[0].value === null) {
        resolve(null);
      } else {
        const vb = vbs[0];
        if (vb.type === 128 || vb.type === 129) {
          resolve(null);
        } else {
          const val = Buffer.isBuffer(vb.value) ? vb.value.toString() : vb.value.toString();
          resolve({ oid, value: val, type: vb.type });
        }
      }
    });
  });
});

Promise.all(promises).then(results => {
  results.filter(r => r !== null).forEach(r => {
    console.log(`${r.oid} = [tipo:${r.type}] ${r.value}`);
  });
  session.close();
  console.log('\nConcluído.');
});
