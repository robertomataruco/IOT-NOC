import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ricastechnology.noczabbix',
  appName: 'NOC Portal Zabbix',
  webDir: 'public', // Usamos a pasta public existente para evitar erros de pasta vazia
  server: {
    // Altere para a URL ou IP do seu servidor que as pessoas usarão para acessar o painel.
    // Configurado por padrão com o IP do Ubuntu (192.168.67.94) na porta 3005.
    url: 'http://iot-site.com.br:53005',
    cleartext: true // Necessário para permitir conexões HTTP locais sem HTTPS/SSL
  }
};

export default config;
