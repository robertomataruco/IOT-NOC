const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function run() {
  // 1. Apagar o trap fake "ruUnderVoltage"
  try {
    const deleted = await prisma.trap.deleteMany({
      where: {
        alarmName: 'ruUnderVoltage'
      }
    });
    console.log(`Deletados ${deleted.count} traps fakes.`);
  } catch (err) {
    console.log("Erro ao deletar: ", err.message);
  }

  // 2. Traduzir o trapMappings.json
  const trapMapFile = 'src/lib/trapMappings.json';
  const trapMap = JSON.parse(fs.readFileSync(trapMapFile, 'utf8'));

  const translations = {
    "Overall Alarm (Geral)": "Alarme Geral do Módulo",
    "a-poiDlInputShutdownAlarm": "Desligamento por Potência Alta (A-POI)",
    "a-poiFanFault": "Falha no Ventilador (A-POI)",
    "a-poiLowInputPower": "Subtensão de Entrada (A-POI)",
    "a-poiOverTemperature": "Superaquecimento (A-POI)",
    "a-poiDlInputOverloadAlarm": "Sobrecarga de Potência DL (A-POI)",
    "a-poiDlRfLowPower": "Baixa Potência de RF DL (A-POI)",
    "a-poiVersionMismatch": "Incompatibilidade de Versão (A-POI)",
    "a-poiServiceOff": "Serviço Desativado (A-POI)",
    
    "euOverallAlarm": "Alarme Geral (EU)",
    "euInputUnderVoltage": "Subtensão de Entrada (EU)",
    "euPowerSupplyOverTemperature": "Superaquecimento da Fonte (EU)",
    "euFanFault": "Falha no Ventilador (EU)",
    "euOverTemperature": "Superaquecimento Geral (EU)",
    "euCpriLinkTxFault": "Falha de Transmissão CPRI (EU)",
    "euCpriLinkRxFault": "Falha de Recepção CPRI (EU)",
    "euCpriSyncFault": "Falha de Sincronismo CPRI (EU)",
    "euCpriLinkFault": "Falha no Link CPRI (EU)",
    "euCpriOverTemperature": "Superaquecimento do SFP (EU)",
    "euCpriManufacturerInvalid": "SFP Não Certificado (EU)",
    "euSynthesizerUnlocked": "Falha no Sintetizador (EU)",
    "euHardwareFault": "Falha de Hardware (EU)",
    "euVersionMismatch": "Incompatibilidade de Versão (EU)",
    
    "ruOverallAlarm": "Alarme Geral (RU)",
    "ruHardwareFault": "Falha de Hardware (RU)",
    "ruOverTemperature": "Superaquecimento (RU)",
    "ruUnderVoltage": "Subtensão de Entrada (RU)",
    "ruSfpTxFault": "Falha de Transmissão SFP (RU)",
    "ruSfpRxFault": "Falha de Recepção SFP (RU)",
    "ruSfpSyncfault": "Falha de Sincronismo SFP (RU)",
    "ruSfpOverTemperature": "Superaquecimento do SFP (RU)",
    "ruSfpManufacturerInvalid": "SFP Não Certificado (RU)",
    "ruFanAlarm": "Falha no Ventilador (RU)",
    "ruOverPowerConsumption": "Consumo Excessivo de Energia (RU)",
    "ruOverflow": "Sobrecarga de Entrada UL (RU)",
    "ruLowTransmission": "Baixa Transmissão DL (RU)",
    "ruVswrAlarm": "Alarme de VSWR Alto (RU)",
    "ruAntennaAlarm": "Alarme de Antena/VSWR Crítico (RU)",
    "ruPaAlarm": "Alarme de Amplificador (PA - RU)",
    "ruVersionMismatch": "Incompatibilidade de Versão (RU)",
    "ruServiceOff": "Serviço Desativado (RU)",
    "ruMismatch": "Incompatibilidade RU/EU (RU)",
    "ruDLOutputLowAlarm": "Potência de Saída Baixa (RU)",
    "ruDLOutputOverAlarm": "Potência de Saída Alta (RU)",
    
    "auOverallAlarm": "Alarme Geral (AU)",
    "auPowerSupplyOverTemperature": "Superaquecimento da Fonte (AU)",
    "auPowerSupplyInputUnderVoltage": "Subtensão de Entrada (AU)",
    "auOverTemperature": "Superaquecimento Geral (AU)",
    "auFanFault": "Falha no Ventilador (AU)",
    "auCpriLinkTxFault": "Falha de Transmissão CPRI (AU)",
    "auCpriLinkRxFault": "Falha de Recepção CPRI (AU)",
    "auCpriSyncFault": "Falha de Sincronismo CPRI (AU)",
    "auCpriLinkFault": "Falha no Link CPRI (AU)",
    "auCpriOverTemperature": "Superaquecimento do SFP (AU)",
    "auCpriManufacturerInvalid": "SFP Não Certificado (AU)",
    "auHardwareFault": "Falha de Hardware (AU)",
    "auSynthesizerUnlocked": "Falha no Sintetizador (AU)",
    "auSystemOverTimeDelay": "Atraso no Tempo do Sistema (AU)",
    "auDLInputOverPowerInChannel": "Sobrecarga de Entrada DL (AU)",
    "auBaselineBaselineDismatch": "Topologia Divergente (AU)",
    "auVersionMismatch": "Incompatibilidade de Versão (AU)",
    "auServiceOff": "Serviço Desativado (AU)",
    "auTddNrSyncLoss": "Perda de Sincronismo TDD NR (AU)",
    "auTddLteSyncLoss": "Perda de Sincronismo TDD LTE (AU)",
    "auHeartbeat": "Heartbeat (Keepalive)"
  };

  const descTranslations = {
    "The alarm will occur while any sub-alarm occur in the unit.": "Ocorre quando qualquer sub-alarme no módulo é acionado. Verifique a fonte principal do problema.",
    "The detected channel power >38dBm(Low Power), >50dBm(High Power)": "Potência detectada no canal excede os limites de segurança (Overload). Verifique o atenuador/sinal de entrada.",
    "The alarm will occur while any one of FANs fail.": "Um ou mais ventiladores (Cooler) falharam. Verifique as conexões ou substitua o ventilador.",
    "The alarm will occur while DC input power<38V or AC  input power<100V.": "Tensão de energia muito baixa (Subtensão). Verifique a conexão do cabo ou substitua a fonte.",
    "The detected temperature greater than overtemperature threshold.": "Temperatura do equipamento ultrapassou o limiar máximo (80°C). Verifique a refrigeração do local e o ventilador.",
    "The detected channel power >37dBm(Low Power), >49dBm(High Power)": "Potência de canal detectada muito alta. Necessário verificar atenuação na entrada.",
    "The detected channel power <-40dBm(default value) .": "Potência do canal detectada está muito baixa. Verifique a entrada de RF ou cabos coaxiais.",
    "Module version mismatch to A-POI.": "Versão do módulo incompatível. Verifique as versões de hardware/software.",
    "A-POI service off - A-POI cann't operation.": "O serviço do equipamento foi desativado. Reinicie o equipamento ou ative as operadoras.",
    "The alarm will occur while power supply in high temperature.": "Temperatura elevada na Fonte de Alimentação. Verifique a refrigeração.",
    "\" Indicates one of the following SFP problems :TX/RX levels, Temperature,": "Falha no módulo SFP/Fibra. Verifique se o cabo está conectado corretamente ou se precisa de limpeza/troca.",
    "\" Indicates one of the following SFP problems (aggregated per port):": "Falha no módulo SFP/Fibra. Verifique cabo óptico ou nível de sinal.",
    "Indicates the SFP Synthesizer failure .": "Falha de sintetizador SFP. Possível defeito físico no módulo óptico.",
    "Indicates the SFP Synthesizer failure.": "Falha de sincronismo CPRI/SFP. Verifique a integridade da fibra ou substitua o SFP.",
    "Indicates the SFP link failure.": "Falha total no link da fibra óptica. O cabo pode estar rompido ou desconectado.",
    "Indicates the SFP is in high temperature.": "O módulo de fibra óptica (SFP) está muito quente. Pode causar queda no link.",
    "Indicates the SFP is not certificated by manufactured.": "O SFP não é homologado pelo fabricante. Pode causar instabilidade.",
    "Indicates the SFP is not certificated by manufactured .": "O SFP inserido não é certificado pelo fabricante.",
    "Indicates the system Synthesizer failure .": "Falha no sistema de sincronismo interno.",
    "Indicates the system Synthesizer failure.": "Falha no sintetizador interno do equipamento.",
    "The alarm will occur while the hardware is fail": "Uma falha grave de hardware foi detectada no equipamento. Tente reiniciar.",
    "The alarm will occur while hardware is fail.": "Falha de hardware detectada. Pode ser necessário trocar o equipamento.",
    "The alarm will occur while the hardware is fail.": "Falha grave de hardware detectada na placa.",
    "Module version not match to system version.": "Versões de firmware incompativeis entre a unidade e o sistema principal.",
    "The alarm will occur while the temperature of RU is higher then threshold.": "Superaquecimento detectado no Rádio (RU). Verifique o local de instalação.",
    "The alarm will occur while any one of FANs(totally 4) fail.": "Um dos 4 ventiladores internos falhou. Perigo de superaquecimento.",
    "The alarm will occur while any one of FANs(totally 4) in AU fail.": "Falha em um dos ventiladores da Unidade AU. Necessário troca.",
    "The alarm will occur while RU is working over its design power consumption.": "A unidade está puxando energia acima do consumo máximo projetado (Possível curto).",
    "Indicates the uplink input  of RU is overflow.": "A entrada de uplink no Rádio (RU) está sobrecarregada (Overflow). Afaste os usuários muito próximos à antena.",
    "Indicates the downlink input is normal, but the downlink output of device is too low.": "O sinal de entrada está normal, mas a unidade não está amplificando a saída. Possível falha interna.",
    "Indicates the VSWR is largr than threshold (2.0).": "Alarme de VSWR. Reflexão de sinal muito alta. Verifique os cabos da antena ou conectores mal rosqueados.",
    "Indicates the antenna port VSRW is largr than threshold(3.0).": "Alarme Crítico de VSWR (Antena). Há circuito aberto ou cabo partido após a unidade.",
    "The alarm will occur while PA is alarm.": "Falha no amplificador de potência (PA). O rádio pode parar de transmitir.",
    "Device service off.": "O rádio foi desligado via software ou parou de funcionar.",
    "Device service off .": "Equipamento com serviço interrompido.",
    "The RU and EU module type is not match, the RU work abnormal.": "Incompatibilidade: O Rádio (RU) não suporta a porta em que foi conectado na unidade (EU).",
    "Download Output Power is  less than threshold(-99 dBm as default value)": "Potência de saída extremamente baixa. Ninguém vai conseguir se conectar.",
    "Download Output Power is  more than threshold(48dBm as default value)": "Potência de saída estourada. Pode gerar interferência excessiva.",
    "AU system over time delay , the system delays more than 60us.": "Atraso no sinal de fibra (Delay). O cabo óptico entre os sites pode ser maior que o limite (10km).",
    "The DL input power is more than threshold(10dBm as default value).": "Potência na entrada da AU excede o máximo de 10dBm. Adicione um atenuador antes de ligar a BTS/Repetidor.",
    "The system topology changes, it is different from the baseline .": "Mudança topológica: um novo equipamento foi conectado ou removido incorretamente.",
    "Only in TDD NR band, indicates the TDD NR sync failure.": "Falha de Sincronismo TDD (5G). Verifique o sinal de sincronismo GPS ou rede.",
    "Only in TDD LTE band , indicates the TDD LTE sync failure.": "Falha de Sincronismo TDD (4G). O rádio perdeu a janela de sincronia.",
    "Heartbeat.": "Sinal de vida do equipamento (Keepalive). Funcionamento normal.",
    "Ocorre quando qualquer sub-alarme no módulo é acionado.": "Ocorre quando qualquer sub-alarme no módulo é acionado. Verifique a causa primária no equipamento."
  };

  for (const trapId in trapMap.traps) {
    const trap = trapMap.traps[trapId];
    if (translations[trap.name]) {
      trap.name = translations[trap.name];
    }
    if (descTranslations[trap.descr] || descTranslations[trap.descr.trim()]) {
      trap.descr = descTranslations[trap.descr] || descTranslations[trap.descr.trim()];
    } else {
        // Se a gente já não tiver tradução, mantemos a descrição e a causa originais.
        if (translations[trap.probableCause]) {
            trap.probableCause = translations[trap.probableCause];
        }
    }
  }

  fs.writeFileSync(trapMapFile, JSON.stringify(trapMap, null, 2));
  console.log("Arquivo trapMappings.json atualizado com as traduções para PT-BR.");

  await prisma.$disconnect();
}

run();
