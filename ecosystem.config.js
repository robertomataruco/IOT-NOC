module.exports = {
  apps: [
    {
      name: 'zabbix-dashboard',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        HOSTNAME: '0.0.0.0'
      },
    },
    {
      name: 'kron-receiver',
      script: 'kron-receiver.mjs',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        MQTT_BROKER: 'mqtt://localhost:1883',
        KRON_TOPIC: 'kron/+/data',
      },
    },
    {
      // trap-receiver: escuta traps SNMP UDP na porta 162.
      // IMPORTANTE: porta 162 é privilegiada no Linux.
      // Usamos um wrapper shell (start-trap-receiver.sh) que chama:
      //   authbind --deep node trapReceiver.mjs
      // Pré-requisito (uma única vez como root):
      //   sudo apt install authbind
      //   sudo touch /etc/authbind/byport/162
      //   sudo chown roberto:roberto /etc/authbind/byport/162
      //   sudo chmod 500 /etc/authbind/byport/162
      name: 'trap-receiver',
      script: '/home/roberto/start-trap-receiver.sh',
      interpreter: 'bash',
      env: {
        NODE_ENV: 'production',
      },
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 10,
    },
  ],
};
