import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'SNMP OID 2025 - Alarms-Traps (version 1).csv');
const outputPath = path.join(process.cwd(), 'src/lib/trapMappings.json');

function parseCSV() {
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  
  const mappings = {
    fields: {}, // 1.1.x
    traps: {}   // 1.2.x
  };

  lines.forEach(line => {
    const parts = line.split(';');
    if (parts.length < 3) return;

    const name = parts[1]?.trim();
    const oidFull = parts[2]?.trim();
    const descr = parts[7]?.trim();
    const severityStr = parts[9]?.trim();

    if (!oidFull || !oidFull.includes('15921.60.1.')) return;

    // Extrair o final do OID (ex: 1.1.7 ou 1.2.422)
    const match = oidFull.match(/15921\.60\.1\.(\d+)\.(\d+)/);
    if (!match) return;

    const type = match[1]; // "1" para campos, "2" para traps
    const id = match[2];

    if (type === '1') {
      mappings.fields[id] = { name, descr };
    } else if (type === '2') {
      // Tentar extrair severidade numérica do texto "INTEGER {notification(0),minor(1)...}"
      let severity = 0;
      if (severityStr && severityStr.includes('(')) {
        const sevMatch = severityStr.match(/\((\d+)\)/);
        if (sevMatch) severity = parseInt(sevMatch[1]);
      }

      mappings.traps[id] = { 
        name, 
        descr, 
        severity,
        probableCause: parts[7]?.trim(),
        handleMeasures: parts[10]?.trim()
      };
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2));
  console.log('Mapeamento gerado com sucesso em src/lib/trapMappings.json');
}

parseCSV();
