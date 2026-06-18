const fs = require('fs');
const readline = require('readline');

async function processCSV() {
  const fileStream = fs.createReadStream('MAXAlarmThresholds_V3.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const oids = {};
  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    // A CSV separator here is semicolon ';' and some fields might be quoted if they contain ';'
    // But looking at the output, the fields are separated by ';' and some values are quoted.
    // Let's do a simple regex split that respects quotes.
    const parts = [];
    let currentPart = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ';' && !insideQuotes) {
        parts.push(currentPart.trim());
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart.trim());

    if (parts.length >= 8) {
      const name = parts[0];
      const oidRaw = parts[1];
      const cause = parts[5];
      let handleMeasures = parts[7];

      if (!oidRaw) continue;

      const oid = oidRaw.trim().replace(/^\./, '');
      if (oid.startsWith('1.3.6.1.4.1.15921')) {
        oids['.' + oid] = {
          name: name,
          cause: cause,
          action: handleMeasures.replace(/^"|"$/g, '').replace(/\n/g, ' ')
        };
      }
    }
  }

  // Preencher com os alarmes traduzidos que já tínhamos (opcional, ou podemos usar os nomes em inglês da MIB)
  // Vamos mesclar para manter os nomes bonitos se existirem
  const currentMapping = {
    ".1.3.6.1.4.1.15921.60.1.2.402": "Alta Temperatura na Fonte",
    ".1.3.6.1.4.1.15921.60.1.2.403": "Subtensão de Entrada (Fonte)",
    ".1.3.6.1.4.1.15921.60.1.2.404": "Alta Temperatura Geral",
    ".1.3.6.1.4.1.15921.60.1.2.405": "Falha no Cooler (Fan)",
    ".1.3.6.1.4.1.15921.60.1.2.406": "Falha de Transmissão CPRI",
    ".1.3.6.1.4.1.15921.60.1.2.407": "Falha de Recepção CPRI",
    ".1.3.6.1.4.1.15921.60.1.2.408": "Falha de Sincronismo CPRI",
    ".1.3.6.1.4.1.15921.60.1.2.409": "Falha no Link CPRI",
    ".1.3.6.1.4.1.15921.60.1.2.410": "Alta Temperatura no SFP",
    ".1.3.6.1.4.1.15921.60.1.2.412": "Falha de Hardware",
    ".1.3.6.1.4.1.15921.60.1.2.415": "Atraso de Tempo do Sistema",
    ".1.3.6.1.4.1.15921.60.1.2.416": "Sobrecarga de Entrada DL",
    ".1.3.6.1.4.1.15921.60.1.2.418": "Versão Incompatível",
    ".1.3.6.1.4.1.15921.60.1.2.419": "Serviço Desativado",
    ".1.3.6.1.4.1.15921.60.1.2.420": "Perda de Sincronismo TDD"
  };

  for (const oid in oids) {
    if (currentMapping[oid]) {
      oids[oid].name = currentMapping[oid];
    }
  }

  // Adicionar os OIDs antigos que talvez não estejam no CSV
  for (const oid in currentMapping) {
    if (!oids[oid]) {
      oids[oid] = {
        name: currentMapping[oid],
        cause: "Causa não definida.",
        action: "Verifique o equipamento."
      };
    }
  }

  fs.writeFileSync('src/lib/alarmMapping.json', JSON.stringify({ oids: oids }, null, 2));
  console.log('alarmMapping.json gerado com sucesso com causas e ações!');
}

processCSV();
