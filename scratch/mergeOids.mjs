import fs from 'fs';
import path from 'path';

// Determinar o caminho do arquivo CSV (V4 com prioridade, caindo de volta para V3)
let csvPath = path.join(process.cwd(), 'MAXAlarmThresholds_V4.csv');
if (!fs.existsSync(csvPath)) {
  console.log("MAXAlarmThresholds_V4.csv não encontrado no diretório local. Usando MAXAlarmThresholds_V3.csv...");
  csvPath = path.join(process.cwd(), 'MAXAlarmThresholds_V3.csv');
} else {
  console.log("Encontrado MAXAlarmThresholds_V4.csv! Processando...");
}

const mappingsPath = path.join(process.cwd(), 'src/lib/trapMappings.json');

// Função auxiliar para parsear linha de CSV lidando com campos entre aspas e ponto-e-vírgula
function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ';' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function main() {
  if (!fs.existsSync(mappingsPath)) {
    console.error("Erro: src/lib/trapMappings.json não existe!");
    return;
  }

  const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf8'));
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  // Dividir linhas lidando com quebras dentro de aspas
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    }
    
    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  console.log(`Linhas do CSV carregadas: ${lines.length}`);
  
  let mergedCount = 0;
  let newCount = 0;

  for (let i = 1; i < lines.length; i++) { // Pular cabeçalho
    const parts = parseCsvLine(lines[i]);
    if (parts.length < 3) continue;

    const alarmName = parts[0];
    const oidFull = parts[1];
    const probableCause = parts[5];
    const handleMeasures = parts[7];

    if (!oidFull) continue;

    // Extrair ID do OID Comba (ex: .1.3.6.1.4.1.15921.60.1.2.100)
    const match = oidFull.match(/15921\.60\.1\.2\.(\d+)/);
    if (!match) continue;

    const id = match[1];

    // Tradução básica de severidade por palavra-chave no CSV
    const hierarchy = parts[4]?.toLowerCase() || '';
    let severity = 0;
    if (hierarchy.includes('critic')) severity = 3;
    else if (hierarchy.includes('major')) severity = 2;
    else if (hierarchy.includes('minor')) severity = 1;

    // Se já existe no mapeamento, faz o merge da causa e ação técnica
    if (mappings.traps[id]) {
      mappings.traps[id].probableCause = probableCause || mappings.traps[id].probableCause;
      mappings.traps[id].handleMeasures = handleMeasures || mappings.traps[id].handleMeasures;
      mappings.traps[id].severity = severity || mappings.traps[id].severity;
      mergedCount++;
    } else {
      // Se não existe, cria com tradução técnica
      // Tradução aproximada do nome do alarme do padrão camelCase/PascalCase do OID
      let formattedName = alarmName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();

      mappings.traps[id] = {
        name: formattedName,
        descr: probableCause || "Alarme registrado do equipamento.",
        severity: severity,
        probableCause: probableCause || "Causa indeterminada.",
        handleMeasures: handleMeasures || "Verificar conexões físicas do equipamento."
      };
      newCount++;
    }
  }

  fs.writeFileSync(mappingsPath, JSON.stringify(mappings, null, 2), 'utf8');
  console.log(`Processamento concluído com sucesso!`);
  console.log(`- Alertas existentes enriquecidos: ${mergedCount}`);
  console.log(`- Novos alertas catalogados: ${newCount}`);
}

main().catch(err => console.error(err));
