import snmp from 'net-snmp';

const ip = '192.170.114.101';
const community = 'ricas';

const session = snmp.createSession(ip, community, { version: snmp.Version2c });

const oids = [
  '1.3.6.1.4.1.15921.60.2.1.2.0', // auEquipmentModel
  '1.3.6.1.4.1.15921.60.2.1.4.0', // auEquipmentSN
  '1.3.6.1.4.1.15921.60.2.1.5.0', // auSiteInfo
  '1.3.6.1.4.1.15921.60.2.1.7.0', // auHardwareVersion
  '1.3.6.1.4.1.15921.60.2.1.14.0', // auSystemVersion
  '1.3.6.1.4.1.15921.60.2.1.17.0', // auFirmwareVersion
];

session.get(oids, (err, vbs) => {
  if (err) {
    console.error(err);
  } else {
    vbs.forEach(vb => {
      console.log(`${vb.oid} = ${vb.value}`);
    });
  }
  session.close();
});
