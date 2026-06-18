import axios from 'axios';

async function main() {
  try {
    // Para testar o endpoint sem autenticação (ou ver se ele retorna 401)
    const res = await axios.get('http://127.0.0.1:3005/api/admin/devices/b44bf17a-05c0-4899-83a1-f1f6e4e6af32/snmp');
    console.log("Response:", res.status, res.data);
  } catch (err) {
    console.error("Fetch failed:", err.message);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
  }
}

main();
