import axios from 'axios';

async function main() {
  try {
    const res = await axios.get('http://127.0.0.1:3005/api/traps?deviceId=b44bf17a-05c0-4899-83a1-f1f6e4e6af32');
    console.log("Response Success:", res.data.success);
    console.log("Traps count:", res.data.data?.length);
    if (res.data.data && res.data.data.length > 0) {
      console.log("First trap sample:", JSON.stringify(res.data.data[0], null, 2));
    }
  } catch (err) {
    console.error("Fetch failed:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}

main();
