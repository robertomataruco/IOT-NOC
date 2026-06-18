const fs = require('fs');

const mib = fs.readFileSync('MAX-PRO-DEVICES-MIB-1.0.7.mib', 'utf8');
const lines = mib.split('\n');

const searchTerms = [
    'auFanSpeed', 
    'auSFP', 
    'auSFPTemperature', 
    'auSFPTxPower', 
    'auSFPRxPower', 
    'auDLPower', 
    'auULPower',
    'auDlPower',
    'auUlPower',
    'auDlInputPower',
    'auUlOutputPower'
];

console.log("Searching for OIDs...");

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const term of searchTerms) {
        if (line.includes(term)) {
            // Find the OID definition which usually looks like "term ::= { parent number }" or similar
            // It might be on the next few lines
            for (let j = 0; j < 15; j++) {
                if (i + j < lines.length && lines[i+j].includes('::=')) {
                    console.log(`Line ${i}: ${line.trim()}`);
                    console.log(`  Definition: ${lines[i+j].trim()}`);
                    break;
                }
            }
            break;
        }
    }
}
