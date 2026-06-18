import axios from 'axios';

const ZABBIX_API_URL = process.env.ZABBIX_API_URL || '';
const ZABBIX_API_TOKEN = process.env.ZABBIX_API_TOKEN || '';

let reqId = 1;

export const zabbixRequest = async (method: string, params: any = {}) => {
  if (!ZABBIX_API_URL || !ZABBIX_API_TOKEN) {
    console.warn("ZABBIX_API_URL ou ZABBIX_API_TOKEN não definidos no .env");
  }

  const payload = {
    jsonrpc: "2.0",
    method: method,
    params: params,
    id: reqId++
  };

  try {
    const response = await axios.post(ZABBIX_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json-rpc',
        'Authorization': `Bearer ${ZABBIX_API_TOKEN}`
      }
    });

    if (response.data.error) {
      console.error("Zabbix API Error:", response.data.error);
      throw new Error(response.data.error.data || response.data.error.message);
    }

    return response.data.result;
  } catch (error) {
    console.error(`Erro ao chamar ${method}:`, error);
    throw error;
  }
};

// Funções utilitárias específicas

// 1. Buscar todos os hosts
export const getHosts = async (groupIds?: string[]) => {
  const params: any = {
    output: ["hostid", "name", "status"],
    selectInterfaces: ["ip"]
  };
  
  if (groupIds && groupIds.length > 0) {
    params.groupids = groupIds;
  }

  return zabbixRequest("host.get", params);
};

// 2. Buscar alertas e triggers ativos (Traps)
export const getActiveAlerts = async (groupIds?: string[]) => {
  const params: any = {
    output: [
      "triggerid",
      "description",
      "priority",
      "lastchange"
    ],
    filter: {
      value: 1 // 1 significa estado de "Problema"
    },
    expandDescription: 1,
    selectHosts: ["name"],
    sortfield: "lastchange",
    sortorder: "DESC",
    limit: 20
  };

  if (groupIds && groupIds.length > 0) {
    params.groupids = groupIds;
  }

  return zabbixRequest("trigger.get", params);
};
// 3. Buscar grupos de hosts
export const getHostGroups = async () => {
  return zabbixRequest("hostgroup.get", {
    output: ["groupid", "name"]
  });
};

// 4. Criar um grupo de hosts (Site)
export const createHostGroup = async (name: string) => {
  return zabbixRequest("hostgroup.create", {
    name: name
  });
};

// 5. Criar um host (Dispositivo)
export const createHost = async (name: string, ip: string, groupIds: string[]) => {
  return zabbixRequest("host.create", {
    host: name,
    interfaces: [
      {
        type: 1,
        main: 1,
        useip: 1,
        ip: ip,
        dns: "",
        port: "10050"
      }
    ],
    groups: groupIds.map(id => ({ groupid: id })),
    status: 0 // 0 = monitored
  });
};
