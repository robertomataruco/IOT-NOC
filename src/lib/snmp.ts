import snmp from 'net-snmp';

export class SNMPClient {
  private session: any;

  constructor(ip: string, community: string = 'ricas', options?: { timeout?: number, retries?: number }) {
    console.log(`[SNMP] Criando sessão para ${ip} com comunidade '${community}'`);
    this.session = snmp.createSession(ip, community, {
      port: 161,
      retries: options?.retries !== undefined ? options.retries : 3, // 3 retentativas para evitar falso positivo por perda de pacotes UDP
      timeout: options?.timeout !== undefined ? options.timeout : 4000, // 4 segundos de timeout
      version: snmp.Version2c
    });
  }

  async ping(): Promise<boolean> {
    return new Promise((resolve) => {
      const testOid = '1.3.6.1.2.1.1.2.0'; // sysObjectID de MIB-II padrão
      this.session.get([testOid], (err: any) => {
        if (err) {
          console.log(`[SNMP] Rápido ping para ${testOid} FALHOU: ${err.message}`);
          resolve(false);
        } else {
          console.log(`[SNMP] Rápido ping com SUCESSO!`);
          resolve(true);
        }
      });
    });
  }

  async get(oids: string[]): Promise<any[]> {
    const cleanOids = oids.map(o => o.replace(/^\./, ''));
    
    console.log(`[SNMP] Buscando ${cleanOids.length} OIDs em lotes paralelos...`);
    
    const results: any[] = [];
    const batchSize = 15; // Lote seguro para concorrência
    
    for (let i = 0; i < cleanOids.length; i += batchSize) {
      const batch = cleanOids.slice(i, i + batchSize);
      
      const promises = batch.map(oid => {
        return new Promise<any>((resolve) => {
          this.session.get([oid], (err: any, vbs: any[]) => {
            if (err) {
              console.log(`[SNMP]   ${oid} → ERRO: ${err.message}`);
              resolve(null);
              return;
            }
            if (!vbs || vbs.length === 0) {
              console.log(`[SNMP]   ${oid} → SEM RESPOSTA`);
              resolve(null);
              return;
            }
            const vb = vbs[0];
            // Tipos 128=noSuchObject, 129=noSuchInstance, 130=endOfMibView
            if (vb.type === 128 || vb.type === 129 || vb.type === 130) {
              console.log(`[SNMP]   ${oid} → NÃO EXISTE (tipo ${vb.type})`);
              resolve(null);
              return;
            }
            let val: string;
            if (Buffer.isBuffer(vb.value)) {
              val = vb.value.toString();
            } else if (vb.value !== null && vb.value !== undefined) {
              val = vb.value.toString();
            } else {
              val = "0";
            }
            console.log(`[SNMP]   ${oid} → ${val} (tipo ${vb.type})`);
            resolve({ oid: vb.oid, value: val });
          });
        });
      });

      const batchResults = await Promise.all(promises);
      for (const r of batchResults) {
        if (r !== null) {
          results.push(r);
        }
      }
    }
    
    console.log(`[SNMP] Resultado: ${results.length} de ${cleanOids.length} OIDs responderam.`);
    return results;
  }

  async walk(rootOid: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const cleanRoot = rootOid.trim().replace(/^\./, '');
      console.log(`[SNMP] Iniciando WALK em: ${cleanRoot}`);
      
      this.session.walk(cleanRoot, 100, (varbinds: any[]) => {
        for (const vb of varbinds) {
          results.push({
            oid: vb.oid,
            value: vb.value ? vb.value.toString() : "0",
            type: vb.type
          });
        }
      }, (error: any) => {
        if (error) {
          console.error(`[SNMP] Erro no WALK:`, error);
          reject(error);
        } else {
          console.log(`[SNMP] WALK finalizado com ${results.length} resultados.`);
          resolve(results);
        }
      });
    });
  }

  close() {
    this.session.close();
  }
}
