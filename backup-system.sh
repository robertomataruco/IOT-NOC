#!/bin/bash
# =======================================================
#  backup-system.sh — Backup Completo do Sistema
#  Execute como ROOT no Ubuntu: bash /tmp/backup-system.sh
# =======================================================

PROJECT="/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"
BACKUP_ROOT="/home/roberto/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/backup_$TIMESTAMP"
DB_FILE="$PROJECT/prisma/dashboard.db"

echo ""
echo "========================================="
echo "  💾 BACKUP COMPLETO DO SISTEMA"
echo "  Data: $(date '+%d/%m/%Y %H:%M:%S')"
echo "========================================="
echo ""

# Cria pasta de backup
mkdir -p "$BACKUP_DIR"

# ─── 1. Backup do Banco de Dados ───
echo "[1/4] Backup do banco de dados SQLite..."
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/dashboard.db"
    echo "  OK — dashboard.db copiado ($(du -sh "$DB_FILE" | cut -f1))"
else
    echo "  AVISO: Banco de dados não encontrado!"
fi
echo ""

# ─── 2. Backup do .env.local ───
echo "[2/4] Backup das configurações (.env.local)..."
if [ -f "$PROJECT/.env.local" ]; then
    cp "$PROJECT/.env.local" "$BACKUP_DIR/.env.local"
    echo "  OK — .env.local copiado"
else
    echo "  AVISO: .env.local não encontrado"
fi
echo ""

# ─── 3. Backup completo do código (sem node_modules e .next) ───
echo "[3/4] Compactando código-fonte completo..."
tar -czf "$BACKUP_DIR/source_code.tar.gz" \
    -C "/home/roberto/Projeto NOVO ZABBIX" \
    --exclude="zabbix-dashboard/node_modules" \
    --exclude="zabbix-dashboard/.next" \
    --exclude="zabbix-dashboard/prisma/*.db-*" \
    "zabbix-dashboard" \
    2>/dev/null
echo "  OK — Código compactado ($(du -sh "$BACKUP_DIR/source_code.tar.gz" | cut -f1))"
echo ""

# ─── 4. Backup da config do Nginx (se existir) ───
echo "[4/4] Backup de configurações do Nginx..."
if [ -d /etc/nginx/sites-available ]; then
    mkdir -p "$BACKUP_DIR/nginx"
    cp -r /etc/nginx/sites-available/ "$BACKUP_DIR/nginx/"
    [ -d /etc/nginx/ssl ] && cp -r /etc/nginx/ssl/ "$BACKUP_DIR/nginx/ssl/" 2>/dev/null || true
    echo "  OK — Configurações do Nginx copiadas"
else
    echo "  Nginx não instalado — ignorado"
fi
echo ""

# ─── Sumário ───
chown -R roberto:roberto "$BACKUP_DIR"

echo "========================================="
echo "  ✅ BACKUP CONCLUÍDO!"
echo ""
echo "  Local: $BACKUP_DIR"
echo ""
echo "  Conteúdo:"
ls -lh "$BACKUP_DIR"
echo ""
echo "  Espaço total:"
du -sh "$BACKUP_DIR"
echo ""
echo "  Backups disponíveis em $BACKUP_ROOT:"
ls -lt "$BACKUP_ROOT" | head -10
echo "========================================="
