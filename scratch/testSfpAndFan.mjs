import snmp from 'net-snmp';

const ip = "192.170.115.101";
const community = "ricas";
const session = snmp.createSession(ip, community, { version: snmp.Version2c });

console.log(`--- SCANNING AU METRICS ON ${ip} ---`);

// 1. auFanSpeed
session.get(["1.3.6.1.4.1.15921.60.2.1.8.0"], (error, varbinds) => {
    if (error) {
        console.error("❌ auFanSpeed Error:", error.message);
    } else {
        console.log("✅ auFanSpeed Response:", varbinds[0].value.toString());
    }
});

// 2. Walk auRfInfoTable (DL/UL Power for AU/AUFR)
console.log("Walking auRfInfoTable (1.3.6.1.4.1.15921.60.2.3.1)...");
session.walk("1.3.6.1.4.1.15921.60.2.3.1", 100, (varbinds) => {
    for (const vb of varbinds) {
        console.log(`[RF] ${vb.oid} = ${vb.value.toString()} (tipo: ${vb.type})`);
    }
}, (error) => {
    if (error) console.error("❌ auRfInfoTable Walk Error:", error.message);
});

// 3. Walk auSFPInfoTable (SFP Info)
console.log("Walking auSFPInfoTable (1.3.6.1.4.1.15921.60.2.4.1)...");
session.walk("1.3.6.1.4.1.15921.60.2.4.1", 100, (varbinds) => {
    for (const vb of varbinds) {
        console.log(`[SFP] ${vb.oid} = ${vb.value.toString()} (tipo: ${vb.type})`);
    }
}, (error) => {
    if (error) console.error("❌ auSFPInfoTable Walk Error:", error.message);
    session.close();
});
