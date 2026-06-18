import fetch from 'node-fetch';

async function main() {
  const res = await fetch('https://cdn.jsdelivr.net/npm/dxf-viewer@1.0.47/+esm');
  const code = await res.text();
  
  // Find method definitions or search for load
  console.log("ESM Code length:", code.length);
  
  // Let's print out all occurrences of "load" or "Load" in the code
  const regex = /[a-zA-Z0-9_$]{1,30}load[a-zA-Z0-9_$]{0,30}/gi;
  const matches = [...new Set(code.match(regex))];
  console.log("Matches containing 'load':", matches);
}

main().catch(console.error);
