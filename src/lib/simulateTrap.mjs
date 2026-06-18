import axios from 'axios';

const mockTrapData = `
ZBXTRAP 192.170.115.101
snmpTrapOID.0 = OID: SNMPv2-SMI::enterprises.15921.60.1.2.303
SNMPv2-SMI::enterprises.15921.60.1.1.7 = STRING: "LOJA-MAG-01"
SNMPv2-SMI::enterprises.15921.60.1.1.4 = STRING: "SN-998877"
SNMPv2-SMI::enterprises.15921.60.1.1.13 = STRING: "1"
`;

async function simulate() {
  try {
    await axios.post('http://127.0.0.1:3005/api/traps', {
      trapText: mockTrapData
    });
    console.log('✅ Trap simulada para o IP 192.170.115.101');
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

simulate();
