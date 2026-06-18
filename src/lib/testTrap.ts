import { parseZabbixTrap } from './trapParser.ts';

const exampleTrap = `ZBXTRAP 192.170.114.101
DISMAN-EVENT-MIB::sysUpTimeInstance = Timeticks: (22838134) 2 days, 15:26:21.34, SNMPv2-MIB::snmpTrapOID.0 = OID: SNMPv2-SMI::enterprises.15921.60.1.2.422, SNMPv2-SMI::enterprises.15921.60.1.1.1 = Counter32: 5601, SNMPv2-SMI::enterprises.15921.60.1.1.2 = STRING: "2018-04-03 17:26:44", SNMPv2-SMI::enterprises.15921.60.1.1.3 = STRING: "DCU", SNMPv2-SMI::enterprises.15921.60.1.1.4 = STRING: "AA23B0115815", SNMPv2-SMI::enterprises.15921.60.1.1.5 = STRING: "N/A", SNMPv2-SMI::enterprises.15921.60.1.1.6 = STRING: "AA23B0115815", SNMPv2-SMI::enterprises.15921.60.1.1.7 = STRING: "S1 MAG Shopping", SNMPv2-SMI::enterprises.15921.60.1.1.8 = STRING: "N/A", SNMPv2-SMI::enterprises.15921.60.1.1.9 = INTEGER: 2, SNMPv2-SMI::enterprises.15921.60.1.1.10 = STRING: "N/A", SNMPv2-SMI::enterprises.15921.60.1.1.11 = STRING: "N/A", SNMPv2-SMI::enterprises.15921.60.1.1.12 = INTEGER: 0, SNMPv2-SMI::enterprises.15921.60.1.1.13 = INTEGER: 0`;

const result = parseZabbixTrap(exampleTrap);

console.log('--- RESULTADO DO TESTE ---');
console.log(JSON.stringify(result, null, 2));
