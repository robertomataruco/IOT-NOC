#!/bin/bash
# ============================================================
# 🚀 SCRIPT DE ATUALIZAÇÃO — Ricas Tecnologia Dashboard
# Uso: bash deploy.sh
# ============================================================

set -e  # Para o script se qualquer comando falhar

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # Sem cor

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${BOLD}  🚀 DEPLOY — Ricas Tecnologia Dashboard${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# --- 1. Atualizar código do repositório ---
echo -e "${YELLOW}[1/6] Baixando atualizações do repositório...${NC}"
git pull origin main
echo -e "${GREEN}✅ Código atualizado!${NC}"
echo ""

# --- 2. Instalar dependências novas (se houver) ---
echo -e "${YELLOW}[2/6] Instalando dependências...${NC}"
npm install --production=false --legacy-peer-deps
echo -e "${GREEN}✅ Dependências OK!${NC}"
echo ""

# --- 3. Sincronizar o banco de dados (schema changes) ---
echo -e "${YELLOW}[3/6] Sincronizando banco de dados (Prisma)...${NC}"
npx prisma db push --accept-data-loss
echo -e "${GREEN}✅ Banco de dados sincronizado!${NC}"
echo ""

# --- 4. Regenerar o Prisma Client ---
echo -e "${YELLOW}[4/6] Gerando Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✅ Prisma Client gerado!${NC}"
echo ""

# --- 5. Build da aplicação Next.js ---
echo -e "${YELLOW}[5/6] Fazendo build da aplicação...${NC}"
npm run build
echo -e "${GREEN}✅ Build concluído!${NC}"
echo ""

# --- 6. Reiniciar o PM2 ---
echo -e "${YELLOW}[6/6] Reiniciando serviços PM2...${NC}"

# Reinicia o servidor principal
pm2 restart zabbix-dashboard --update-env 2>/dev/null || pm2 start ecosystem.config.js --update-env

# Reinicia o Trap Receiver (se estiver rodando)
pm2 restart trap-receiver --update-env 2>/dev/null && echo "Trap receiver reiniciado." || echo "Trap receiver não encontrado no PM2 (verifique se está rodando)."

# Salva a configuração do PM2
pm2 save

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${BOLD}${GREEN}  ✅ DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "  📡 Dashboard:   http://localhost:3005"
echo -e "  📊 PM2 Status:  pm2 status"
echo -e "  📋 Logs:        pm2 logs zabbix-dashboard"
echo ""
