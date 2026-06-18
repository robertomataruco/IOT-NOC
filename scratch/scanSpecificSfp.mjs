import snmp from 'net-snmp';

const ip = "192.170.115.101";
const community = "ricas";
const session = snmp.createSession(ip, community, { version: snmp.Version2c });

console.log("Fetching SFP info...");
// We will generate the GET list for SFP 1-14
const sfpOids = [];
for (let i = 1; i <= 14; i++) {
    sfpOids.push(`1.3.6.1.4.1.15921.60.2.4.1.1.2.${i}.0`); // Port Name
    sfpOids.push(`1.3.6.1.4.1.15921.60.2.4.1.1.3.${i}.0`); // Temp
    sfpOids.push(`1.3.6.1.4.1.15921.60.2.4.1.1.4.${i}.0`); // Tx Power
    sfpOids.push(`1.3.6.1.4.1.15921.60.2.4.1.1.5.${i}.0`); // Rx Power
}

session.get(sfpOids, (error, varbinds) => {
    if (error) {
        console.error("❌ SFP Error:", error.message);
    } else {
        console.log("✅ SFP Success!");
        for (let i = 0; i < 14; i++) {
            const name = varbinds[i*4].value.toString();
            const temp = varbinds[i*4 + 1].value.toString();
            const tx = varbinds[i*4 + 2].value.toString();
            const rx = varbinds[i*4 + 3].value.toString();
            if (rx !== "-99.00" || tx !== "-99.00") {
                console.log(`Port ${name} (Index ${i+1}): Temp=${temp}°C, Tx=${tx} dBm, Rx=${rx} dBm`);
            }
        }
    }
});

console.log("Fetching RF Info...");
// We will generate GET for RF channels 1-16
const rfOids = [];
for (let j = 1; j <= 16; j++) {
    rfOids.push(`1.3.6.1.4.1.15921.60.2.3.1.1.2.${j}.0`); // DL Input Power
    rfOids.push(`1.3.6.1.4.1.15921.60.2.3.1.1.3.${j}.0`); // UL Output Power
}

session.get(rfOids, (error, varbinds) => {
    if (error) {
        console.error("❌ RF Error:", error.message);
    } else {
        console.log("✅ RF Success!");
        for (let j = 0; j < 16; j++) {
            const dl = varbinds[j*2].value.toString();
            const ul = varbinds[j*2 + 1].value.toString();
            if (dl !== "-99.00" || ul !== "-99.00") {
                console.log(`Channel ${j+1}: DL Input Power=${dl} dBm, UL Output Power=${ul} dBm`);
            }
        }
    }
    session.close();
});
