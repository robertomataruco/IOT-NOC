import trapMappings from './trapMappings.json';
import alarmMapping from './alarmMapping.json';

export interface ProcessedTrap {
  oid: string;
  name: string;
  description: string;
  severity: number;
  ctrlName: string;
  deviceSerial: string;
  senderIp: string; // Novo campo para o IP LAN
  timestamp: string;
  fullText: string;
  rawFields: Record<string, string>;
}

export function parseZabbixTrap(rawText: string): ProcessedTrap | null {
  try {
    // Detecção de trap do controlador AGST Conflex (Enterprise 42588)
    if (rawText.includes("42588")) {
      const processed: Partial<ProcessedTrap> = {
        fullText: rawText,
        rawFields: {}
      };
      
      const ipMatch = rawText.match(/ZBXTRAP\s+(\d+\.\d+\.\d+\.\d+)/);
      if (ipMatch) {
        processed.senderIp = ipMatch[1];
      }

      // Varrer os varbinds da AGST para encontrar qual porta disparou
      // Casos típicos de OID: 1.3.6.1.4.1.42588.3.4.2.X ou similar
      const vbRegex = /(1\.3\.6\.1\.4\.1\.42588\.[0-9.]+)\s*=\s*(.*?):\s*(.*)/g;
      let match;
      let isClear = false;
      let alarmName = "Alerta Controladora AGST";
      let alarmDesc = "Alteração de estado detectada no controlador AGST.";
      let severity = 2; // Default: Menor/Warning
      let index = "0";
      let type = "AGST";

      while ((match = vbRegex.exec(rawText)) !== null) {
        const oid = match[1];
        let val = match[3].trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }

        processed.rawFields![oid] = val;

        const parts = oid.split('.');
        const lastPart = parts[parts.length - 1]; // index (0-indexed)
        const parentOid = parts.slice(0, -1).join('.');

        if (parentOid.endsWith("3.4.2") || parentOid.endsWith("3.4.4")) {
          // Entrada Universal
          const euNum = parseInt(lastPart) + 1;
          alarmName = `Entrada Universal EU${euNum}`;
          alarmDesc = `Entrada Universal EU${euNum} com status: ${val}`;
          index = euNum.toString();
          type = "EU";
          if (val.toLowerCase().includes("alarme") || val.toLowerCase().includes("falha") || val.toLowerCase().includes("on")) {
            isClear = false;
            severity = 3; // Major
          } else if (val.toLowerCase().includes("normal") || val.toLowerCase().includes("ok") || val.toLowerCase().includes("off")) {
            isClear = true;
          }
        } else if (parentOid.endsWith("3.2.2") || parentOid.endsWith("3.2.4")) {
          // Entrada Digital
          const edNum = parseInt(lastPart) + 1;
          alarmName = `Entrada Digital ED${edNum}`;
          alarmDesc = `Entrada Digital ED${edNum} com status: ${val}`;
          index = edNum.toString();
          type = "ED";
          if (val.toLowerCase().includes("alarme") || val.toLowerCase().includes("falha") || val.toLowerCase().includes("on")) {
            isClear = false;
            severity = 3;
          } else if (val.toLowerCase().includes("normal") || val.toLowerCase().includes("ok") || val.toLowerCase().includes("off")) {
            isClear = true;
          }
        } else if (parentOid.endsWith("3.1.2") || parentOid.endsWith("3.1.4")) {
          // Saída Digital
          const sdNum = parseInt(lastPart) + 1;
          alarmName = `Saída Digital SD${sdNum}`;
          alarmDesc = `Saída Digital SD${sdNum} com status: ${val}`;
          index = sdNum.toString();
          type = "SD";
          if (val.toLowerCase().includes("alarme") || val.toLowerCase().includes("falha") || val.toLowerCase().includes("on")) {
            isClear = false;
            severity = 2; // Warning
          } else if (val.toLowerCase().includes("normal") || val.toLowerCase().includes("ok") || val.toLowerCase().includes("off")) {
            isClear = true;
          }
        }
      }

      processed.oid = `1.3.6.1.4.1.42588.3`;
      processed.name = alarmName;
      processed.description = alarmDesc;
      processed.severity = severity;
      processed.rawFields!["13"] = isClear ? "0" : "1"; // 0 = Clear, 1 = Set
      processed.rawFields!["1"] = index;
      processed.rawFields!["10"] = index;
      processed.rawFields!["11"] = type;

      return processed as ProcessedTrap;
    }

    // Detecção de trap do FCC Alpha
    if (rawText.includes("39553")) {
      const processed: Partial<ProcessedTrap> = {
        fullText: rawText,
        rawFields: {}
      };
      
      // Extrair IP do remetente
      const ipMatch = rawText.match(/ZBXTRAP\s+(\d+\.\d+\.\d+\.\d+)/);
      if (ipMatch) {
        processed.senderIp = ipMatch[1];
      }

      // Extrair o tipo de trap (se é active ou cease)
      const isClearTrap = rawText.includes("1.3.6.1.4.1.39553.10.4.3.3"); // alarmCeaseTrap
      
      // Extrair alarmIndex, alarmName e alarmLevel
      const alarmIndexMatch = rawText.match(/1\.3\.6\.1\.4\.1\.39553\.10\.4\.2\.1\.1\.\d+\s*=\s*\d+:\s*(\d+)/);
      const alarmNameMatch = rawText.match(/1\.3\.6\.1\.4\.1\.39553\.10\.4\.2\.1\.10\.\d+\s*=\s*\d+:\s*(.*)/);
      const alarmLevelMatch = rawText.match(/1\.3\.6\.1\.4\.1\.39553\.10\.4\.2\.1\.3\.\d+\s*=\s*\d+:\s*(\d+)/);

      const alarmIndex = alarmIndexMatch ? parseInt(alarmIndexMatch[1]) : 0;
      let alarmName = alarmNameMatch ? alarmNameMatch[1].trim() : "";
      if (alarmName.startsWith('"') && alarmName.endsWith('"')) {
        alarmName = alarmName.substring(1, alarmName.length - 1);
      }
      
      const alarmLevel = alarmLevelMatch ? parseInt(alarmLevelMatch[1]) : 1;

      // Traduzir o alarmName de forma legível para o operador, ou usar do alarmMapping
      const alarmMappingOid = `.1.3.6.1.4.1.39553.10.4.2.1.1.${alarmIndex}`;
      const alarmDef = (alarmMapping.oids as any)[alarmMappingOid];

      processed.oid = alarmMappingOid;
      processed.name = alarmDef?.name || alarmName || `Alarme Ativo #${alarmIndex}`;
      processed.description = alarmDef?.cause || `Alarme detectado no FCC Alpha. Index: ${alarmIndex}.`;
      
      // Mapeamento de severidade (alarmLevel no FCC MIB: 0=warning, 1=minor, 2=major, 3=critical)
      processed.severity = alarmLevel + 1; // minor=2, major=3, critical=4

      processed.rawFields!["13"] = isClearTrap ? "0" : "1"; // Campo 13 é usado para set/clear (0=clear, 1=set)
      processed.rawFields!["1"] = alarmIndex.toString();
      processed.rawFields!["10"] = alarmIndex.toString(); // Usado como canal/porta se aplicável
      
      return processed as ProcessedTrap;
    }

    const processed: Partial<ProcessedTrap> = {
      fullText: rawText,
      rawFields: {}
    };

    // 1. Extrair o IP do remetente (ZBXTRAP IP)
    const ipMatch = rawText.match(/ZBXTRAP\s+(\d+\.\d+\.\d+\.\d+)/);
    if (ipMatch) {
      processed.senderIp = ipMatch[1];
    }

    // 1. Extrair o OID do trap principal
    // Suporta formatos: snmpTrapOID.0 = ...422 ou 1.3.6.1.6.3.1.1.4.1.0 = ...422
    // O ID do trap (ex: 422) costuma vir no final do OID da Comba (15921.60.1.2.XXX)
    const trapOidMatch = rawText.match(/(?:snmpTrapOID\.0|1\.3\.6\.1\.6\.3\.1\.1\.4\.1\.0)\s*=\s*.*?(?:15921\.60\.1\.2\.|:)\s*(\d+)(?:\r|\n|$)/m);
    
    let trapId = trapOidMatch ? trapOidMatch[1] : null;
    
    // Fallback: se não achar pelo OID de trap padrão, busca qualquer referência ao branch de alarmes da Comba
    if (!trapId) {
      const fallbackMatch = rawText.match(/15921\.60\.1\.2\.(\d+)/);
      if (fallbackMatch) {
        trapId = fallbackMatch[1];
      }
    }

    if (!trapId) return null;

    const trapDef = (trapMappings.traps as any)[trapId];
    processed.oid = `1.2.${trapId}`;
    processed.name = trapDef?.name || `Unknown Trap (${trapId})`;
    processed.description = trapDef?.descr || 'Sem descrição disponível';
    processed.severity = trapDef?.severity || 0;

    // 2. Extrair os campos (1.1.x)
    // Suporta: enterprises.15921.60.1.1.7 ou 1.3.6.1.4.1.15921.60.1.1.7
    // O final da linha pode ser vírgula, quebra de linha ou o fim da string
    const fieldRegex = /(?:enterprises|1\.3\.6\.1\.4\.1)\.15921\.60\.1\.1\.(\d+)\s*=\s*.*?: (.*?)(?:$|,|\r|\n)/g;
    let match;
    while ((match = fieldRegex.exec(rawText)) !== null) {
      const fieldId = match[1];
      let value = match[2].trim();
      
      // Remover aspas se for string
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }

      processed.rawFields![fieldId] = value;

      // Mapear campos importantes
      if (fieldId === '7') processed.ctrlName = value; // trapCtrlName
      if (fieldId === '4') processed.deviceSerial = value; // trapDeviceSerial
      if (fieldId === '2') processed.timestamp = value; // trapTimeStamp
    }

    // Enriquecer a descrição com dados específicos do canal/alarme, se existirem
    const channelId = processed.rawFields['10'];
    const channelDesc = processed.rawFields['11'];
    
    if (channelId && channelId !== "0" && channelId !== "NA" && channelId !== "N/A") {
      let extraInfo = ` [Canal/Porta: `;
      if (channelDesc && channelDesc !== "0" && channelDesc !== "NA" && channelDesc !== "N/A") {
        extraInfo += `${channelDesc} `;
      }
      extraInfo += `${channelId}]`;
      
      processed.description += extraInfo;
    }

    return processed as ProcessedTrap;
  } catch (error) {
    console.error('Erro ao processar trap:', error);
    return null;
  }
}
