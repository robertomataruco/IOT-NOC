#!/bin/bash
# =====================================================
# fix-trap-port.sh
# Corrige a permissão da porta 162 para o trap-receiver
# Execute como ROOT no Ubuntu: sudo bash fix-trap-port.sh
# =====================================================

set -e

echo ""
echo "============================================="
echo "  FIX: Permissão UDP 162 para trap-receiver "
echo "============================================="
echo ""

# Verificar se está como root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Execute como root: sudo bash fix-trap-port.sh"
    exit 1
fi

# --- PASSO 1: Instalar authbind ---
echo "[1/5] Instalando authbind..."
apt-get install -y authbind 2>/dev/null || true
echo "  ✅ authbind instalado!"

# --- PASSO 2: Criar permissão para porta 162 UDP/TCP ---
echo "[2/5] Configurando permissão para porta 162..."
touch /etc/authbind/byport/162
chown roberto:roberto /etc/authbind/byport/162
chmod 500 /etc/authbind/byport/162
echo "  ✅ Permissão 162 configurada para o usuario roberto!"

# --- PASSO 3: Parar o trap-receiver atual ---
echo "[3/5] Parando trap-receiver antigo..."
su - roberto -c "pm2 delete trap-receiver 2>/dev/null || true"
echo "  ✅ Parado!"

# --- PASSO 4: Verificar se já tem snmptrapd rodando e conflitando ---
echo "[4/5] Verificando conflitos de porta 162..."
CONFLITO=$(lsof -i UDP:162 2>/dev/null | grep -v "COMMAND" | head -3 || true)
if [ -n "$CONFLITO" ]; then
    echo "  ⚠️ CONFLITO DETECTADO na porta 162:"
    echo "  $CONFLITO"
    echo ""
    echo "  Parando snmptrapd se estiver ativo..."
    systemctl stop snmptrapd 2>/dev/null || true
    systemctl disable snmptrapd 2>/dev/null || true
    pkill snmptrapd 2>/dev/null || true
    echo "  ✅ snmptrapd parado!"
else
    echo "  ✅ Nenhum conflito encontrado na porta 162"
fi

# --- PASSO 5: Reiniciar o trap-receiver com authbind ---
echo "[5/5] Reiniciando trap-receiver com authbind..."
PROJECT="/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"

su - roberto -c "
    export NVM_DIR=\"/home/roberto/.nvm\"
    [ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
    cd '$PROJECT'
    pm2 start trapReceiver.mjs --name trap-receiver --interpreter='authbind --deep node' --update-env
    pm2 save
    echo '  ✅ trap-receiver iniciado com authbind!'
    pm2 status
"

echo ""
echo "============================================="
echo "  VERIFICANDO SE A PORTA 162 ESTÁ ABERTA:"
echo "============================================="
sleep 2
ss -tuln | grep 162 || echo "⚠️ Porta 162 ainda não aparece... aguarde alguns segundos."

echo ""
echo "============================================="
echo "  FIX CONCLUÍDO!"
echo "  Teste enviando um trap do Comba."
echo "  Para ver os logs: pm2 logs trap-receiver"
echo "============================================="
