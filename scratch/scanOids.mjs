import snmp from 'net-snmp';

const ip = "192.170.115.101";
const community = "ricas";
const session = snmp.createSession(ip, community, { version: snmp.Version2c });

console.log(`--- INICIANDO SCAN EM ${ip} ---`);

session.walk("1.3.6.1.4.1.15921.60.1", 100, (varbinds) => {
    for (const vb of varbinds) {
        console.log(`${vb.oid} = ${vb.value.toString()} (tipo: ${vb.type})`);
    }
}, (error) => {
    if (error) console.error("Erro:", error);
    session.close();
});
