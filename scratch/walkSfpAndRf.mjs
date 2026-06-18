import snmp from 'net-snmp';

const ip = "192.170.115.101";
const community = "ricas";
const session = snmp.createSession(ip, community, { version: snmp.Version2c, timeout: 3000 });

console.log("--- Walking SFP Table ---");
const sfps = {};

session.walk("1.3.6.1.4.1.15921.60.2.4.1.1", 100, (varbinds) => {
    for (const vb of varbinds) {
        const oid = vb.oid;
        if (!oid.startsWith("1.3.6.1.4.1.15921.60.2.4.1.1")) continue;
        
        const val = vb.value.toString();
        const parts = oid.split('.');
        const col = parseInt(parts[12]);
        const index = parseInt(parts[13]);
        
        if (!sfps[index]) sfps[index] = {};
        
        if (col === 2) sfps[index].name = val;
        if (col === 3) sfps[index].temp = parseInt(val);
        if (col === 4) sfps[index].tx = parseFloat(val);
        if (col === 5) sfps[index].rx = parseFloat(val);
    }
}, (error) => {
    if (error) console.error("SFP Walk Error:", error.message);
    
    console.log("SFP Results:");
    for (const idx in sfps) {
        const sfp = sfps[idx];
        if (sfp.rx !== -99 || sfp.tx !== -99) {
            console.log(`Port ${sfp.name || idx}: Temp=${sfp.temp}°C, Tx=${sfp.tx} dBm, Rx=${sfp.rx} dBm`);
        }
    }
    
    console.log("\n--- Walking RF Table ---");
    const rfs = {};
    session.walk("1.3.6.1.4.1.15921.60.2.3.1.1", 100, (varbinds) => {
        for (const vb of varbinds) {
            const oid = vb.oid;
            if (!oid.startsWith("1.3.6.1.4.1.15921.60.2.3.1.1")) continue;
            
            const val = vb.value.toString();
            const parts = oid.split('.');
            const col = parseInt(parts[12]);
            const index = parseInt(parts[13]);
            
            if (!rfs[index]) rfs[index] = {};
            
            if (col === 2) rfs[index].dl = parseFloat(val);
            if (col === 3) rfs[index].ul = parseFloat(val);
        }
    }, (error) => {
        if (error) console.error("RF Walk Error:", error.message);
        
        console.log("RF Results:");
        for (const idx in rfs) {
            const rf = rfs[idx];
            if (rf.dl !== -99 || rf.ul !== -99) {
                console.log(`Channel ${idx}: DL Input=${rf.dl} dBm, UL Output=${rf.ul} dBm`);
            }
        }
        session.close();
    });
});
