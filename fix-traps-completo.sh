#!/bin/bash
# =====================================================
# fix-traps-completo.sh
# Corrige recebimento de traps SNMP do Comba.
# Execute como ROOT no Ubuntu:
#   sudo bash fix-traps-completo.sh
# =====================================================

set -e

PROJECT="/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"

echo ""
echo "================================================"
echo "   FIX COMPLETO: TRAPS SNMP - Ricas NOC        "
echo "================================================"
echo ""

# Verificar root
if [ "$EUID" -ne 0 ]; then
    echo "❌ ERRO: Execute como root: sudo bash fix-traps-completo.sh"
    exit 1
fi

# ─── PASSO 1: Parar conflitos ───
echo "[1/7] Parando processos que podem conflitar com porta 162..."
systemctl stop snmptrapd 2>/dev/null && echo "  snmptrapd parado" || echo "  snmptrapd nao estava rodando"
systemctl disable snmptrapd 2>/dev/null || true
pkill snmptrapd 2>/dev/null && echo "  processo snmptrapd morto" || echo "  sem processo snmptrapd"

# ─── PASSO 2: Instalar authbind ───
echo ""
echo "[2/7] Instalando authbind..."
apt-get install -y authbind
echo "  ✅ authbind instalado!"

# ─── PASSO 3: Configurar permissão para porta 162 ───
echo ""
echo "[3/7] Configurando authbind para porta 162..."
touch /etc/authbind/byport/162
chown roberto:roberto /etc/authbind/byport/162
chmod 500 /etc/authbind/byport/162
echo "  ✅ Porta 162 liberada para o usuario roberto!"

# ─── PASSO 4: Parar trap-receiver antigo ───
echo ""
echo "[4/7] Parando trap-receiver existente..."
su - roberto -c "
    export NVM_DIR=\"/home/roberto/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
    pm2 delete trap-receiver 2>/dev/null && echo '  trap-receiver removido' || echo '  nao havia trap-receiver rodando'
"

# ─── PASSO 5: Verificar que porta 162 está livre ───
echo ""
echo "[5/7] Verificando que a porta 162 está livre..."
sleep 1
OCUPADA=$(lsof -i UDP:162 2>/dev/null | grep -v COMMAND | head -2 || true)
if [ -n "$OCUPADA" ]; then
    echo "  ⚠️ Porta ainda ocupada:"
    echo "  $OCUPADA"
    echo "  Tentando liberar..."
    fuser -k 162/udp 2>/dev/null || true
    sleep 2
fi
echo "  ✅ Porta 162 disponível!"

# ─── PASSO 6: Criar wrapper script e iniciar via PM2 ───
echo ""
echo "[6/7] Criando wrapper script e iniciando trap-receiver..."

# Criar o wrapper que o PM2 vai executar com bash
# O wrapper carrega o NVM e chama authbind --deep node trapReceiver.mjs
cat > /home/roberto/start-trap-receiver.sh << 'WRAPPER_EOF'
#!/bin/bash
export NVM_DIR="/home/roberto/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd "/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"
exec authbind --deep node trapReceiver.mjs
WRAPPER_EOF

chown roberto:roberto /home/roberto/start-trap-receiver.sh
chmod +x /home/roberto/start-trap-receiver.sh
echo "  ✅ Wrapper criado em /home/roberto/start-trap-receiver.sh"

su - roberto -c "
    export NVM_DIR=\"/home/roberto/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
    pm2 start /home/roberto/start-trap-receiver.sh --name trap-receiver --interpreter bash
    pm2 save
    echo '  ✅ trap-receiver iniciado via wrapper bash + authbind!'
"

# ─── PASSO 7: Verificar se está rodando e escutando ───
echo ""
echo "[7/7] Verificando status final..."
sleep 3
ss -tuln | grep 162 && echo "  ✅ PORTA 162 ESTÁ ABERTA E ESCUTANDO!" || echo "  ❌ Porta 162 ainda não está aberta"

echo ""
echo "[PM2 STATUS]"
su - roberto -c "
    export NVM_DIR=\"/home/roberto/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
    pm2 status
"

echo ""
echo "================================================"
echo "   DIAGNÓSTICO: Últimas linhas do log           "
echo "================================================"
sleep 2
su - roberto -c "
    export NVM_DIR=\"/home/roberto/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
    pm2 logs trap-receiver --lines 20 --nostream
"

echo ""
echo "================================================"
echo "   CORREÇÃO CONCLUÍDA!"
echo ""
echo "   ✅ Para verificar os logs em tempo real:"
echo "      su - roberto -c 'pm2 logs trap-receiver'"
echo ""
echo "   ✅ Para testar o recebimento de trap:"
echo "      snmptrap -v2c -c ricas 127.0.0.1 '' 1.3.6.1.4.1.15921.60"
echo "================================================"
