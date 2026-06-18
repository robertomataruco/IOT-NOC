#!/bin/bash
# ============================================================
# setup-ubuntu.sh
# SCRIPT DE CONFIGURACAO E INSTALACAO LIMPA DIRETO NO UBUNTU
# Para ser executado como ROOT (sudo su) no servidor Linux.
# ============================================================

set -e

PROJECT="/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"
BACKUP_DIR="/tmp/ricas_backup_temp"

echo "========================================="
echo " 🚀 INICIANDO INSTALACAO LIMPA COMO ROOT"
echo "========================================="

# ─── 1. MATAR PROCESSOS TRAVADOS ───
echo ""
echo "[1/7] Parando todos os processos Node/PM2..."
# Para o PM2 do usuario roberto se estiver rodando
su - roberto -c "pm2 kill" 2>/dev/null || true
# Para qualquer node travado
killall -9 node 2>/dev/null || true
pkill -9 node 2>/dev/null || true
echo "  Processos parados!"

# ─── 2. BACKUP DO .ENV.LOCAL ───
echo ""
echo "[2/7] Criando backup de seguranca do .env.local..."
mkdir -p "$BACKUP_DIR"
if [ -f "$PROJECT/.env.local" ]; then
    cp "$PROJECT/.env.local" "$BACKUP_DIR/.env.local"
    echo "  Configuracoes (.env.local) salvas com sucesso!"
else
    echo "  Aviso: .env.local nao encontrado para backup"
fi

# ─── 3. DELECAO COMPLETA E RADICAL ───
echo ""
echo "[3/7] Excluindo pasta antiga e resquicios protegidos..."
rm -rf "$PROJECT"
rm -rf "/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard-old-"* 2>/dev/null || true
mkdir -p "$PROJECT"
echo "  Diretorios limpos!"

# ─── 4. EXTRAIR CODIGO COM PERMISSOES CORRETAS ───
echo ""
echo "[4/7] Extraindo codigo limpo..."
if [ -f /tmp/ricas_deploy_clean.tar.gz ]; then
    tar -xzf /tmp/ricas_deploy_clean.tar.gz -C "$PROJECT" --no-same-permissions
    rm -f /tmp/ricas_deploy_clean.tar.gz
    echo "  Codigo extraido do ricas_deploy_clean.tar.gz!"
elif [ -f /tmp/ricas_deploy.tar.gz ]; then
    tar -xzf /tmp/ricas_deploy.tar.gz -C "$PROJECT" --no-same-permissions
    rm -f /tmp/ricas_deploy.tar.gz
    echo "  Codigo extraido do ricas_deploy.tar.gz!"
else
    echo "  ERRO: Nenhum arquivo tar.gz encontrado em /tmp!"
    exit 1
fi

# Ajusta a posse da pasta pai, filha e de todo o home do usuario roberto (incluindo caches ocultos como .npm e .pm2)
chown -R roberto:roberto "/home/roberto/Projeto NOVO ZABBIX"
chown -R roberto:roberto "/home/roberto"
chmod -R 755 "/home/roberto/Projeto NOVO ZABBIX"
echo "  Permissoes de todo o Home ajustadas para roberto:roberto e gravaveis!"

# ─── 5. RESTAURAR DADOS ───
echo ""
echo "[5/7] Restaurando configuracoes e banco..."
if [ -f "$BACKUP_DIR/.env.local" ]; then
    cp "$BACKUP_DIR/.env.local" "$PROJECT/.env.local"
    echo "  .env.local restaurado com sucesso!"
fi
rm -rf "$BACKUP_DIR"

if [ -f /tmp/dashboard.db ]; then
    mkdir -p "$PROJECT/prisma"
    mv /tmp/dashboard.db "$PROJECT/prisma/dashboard.db"
    echo "  Banco de dados migrado com sucesso!"
fi

# Garante que todos os arquivos restaurados pertencem ao usuario roberto e sao gravaveis (755)
chown -R roberto:roberto "$PROJECT"
chmod -R 755 "$PROJECT"

# ─── 6. EXECUTAR COMANDO DE INSTALACAO COMO USUARIO ROBERTO ───
echo ""
echo "[6/7] Instalando pacotes e compilando Next.js (como usuario roberto)..."
# Executa como usuario roberto para evitar que arquivos de dependencias fiquem como root!
su - roberto -c "cd '$PROJECT' && npm cache clean --force"
su - roberto -c "cd '$PROJECT' && npm install --production=false --legacy-peer-deps"
su - roberto -c "cd '$PROJECT' && npx prisma db push --accept-data-loss"
su - roberto -c "cd '$PROJECT' && npx prisma generate"
su - roberto -c "cd '$PROJECT' && npm run build"
echo "  Instalacao e compilacao concluidas!"

# ─── 7. REINICIAR PM2 COMO USUARIO ROBERTO ───
echo ""
echo "[7/7] Inicializando PM2 (como usuario roberto)..."
su - roberto -c "cd '$PROJECT' && pm2 start ecosystem.config.js --update-env"
su - roberto -c "cd '$PROJECT' && pm2 start trapReceiver.mjs --name trap-receiver --update-env"
su - roberto -c "pm2 save"

echo ""
echo "========================================="
echo " 🎉 INSTALACAO LIMPA CONCLUIDA COM SUCESSO!"
echo " Acesse: http://192.168.67.94:3005"
echo "========================================="
su - roberto -c "pm2 status"
