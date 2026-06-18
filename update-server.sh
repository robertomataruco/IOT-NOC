#!/bin/bash
# =======================================================
#  update-server.sh — Script de Atualização do Servidor
#  Execute como ROOT no Ubuntu: bash /tmp/update-server.sh
# =======================================================

set -e

PROJECT="/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"
TAR_CODE="/tmp/ricas_deploy.tar.gz"
DB_FILE="/tmp/dashboard.db"

echo ""
echo "========================================="
echo "  🚀 ATUALIZANDO SERVIDOR RICAS TECNOLOGIA"
echo "========================================="
echo ""

# ─── 0. Verificação básica ───
if [ ! -f "$TAR_CODE" ]; then
    echo "❌ ERRO: Arquivo $TAR_CODE não encontrado!"
    echo "   Envie primeiro pelo Windows com o comando:"
    echo "   .\deploy-send.ps1"
    exit 1
fi

# ─── 0.1 Instalação de Dependências de Renderização CAD (Xvfb & LibreDWG) ───
set +e # Permite falhas parciais em dependências sem abortar o script principal
echo "⚙️ Garantindo dependências de renderização sem tela (Xvfb, OpenGL)..."
apt-get update
apt-get install -y wget curl tar libgl1 libglib2.0-0 libdbus-1-3 libfontconfig1 libxrender1 libxi6 libsm6 xvfb || true

# ─── 0.2 Instalação do Motor ODA File Converter (DWG para DXF Perfeito) ───
echo "⚙️ Verificando motor de conversão de DWG de alta fidelidade (ODA File Converter)..."
if ! command -v ODAFileConverter &> /dev/null && [ ! -f "/usr/bin/ODAFileConverter" ]; then
    echo "  ⚠️ ODA File Converter não encontrado. Baixando e instalando automaticamente (aguarde ~20s)..."
    cd /tmp
    rm -f ODAFileConverter.deb
    
    # Tentativa de download usando Curl (com redirecionamento e SSL flexível) ou Wget como fallback
    curl -L -k -o ODAFileConverter.deb "https://www.opendesign.com/guestfiles/get?filename=ODAFileConverter_QT6_lnxX64_8.3dll_25.12.deb" || \
    wget --no-check-certificate -q "https://www.opendesign.com/guestfiles/get?filename=ODAFileConverter_QT6_lnxX64_8.3dll_25.12.deb" -O ODAFileConverter.deb || true
    
    if [ -f "ODAFileConverter.deb" ] && [ -s "ODAFileConverter.deb" ]; then
        apt-get install -y ./ODAFileConverter.deb || true
        rm -f ODAFileConverter.deb
        
        if [ -f "/usr/lib/x86_64-linux-gnu/libxcb-util.so.1" ] && [ ! -f "/usr/lib/x86_64-linux-gnu/libxcb-util.so.0" ]; then
            ln -sf /usr/lib/x86_64-linux-gnu/libxcb-util.so.1 /usr/lib/x86_64-linux-gnu/libxcb-util.so.0
        fi
    fi
    
    if command -v ODAFileConverter &> /dev/null || [ -f "/usr/bin/ODAFileConverter" ]; then
        echo "  ✅ ODA File Converter instalado com sucesso!"
    else
        echo "  ❌ AVISO: Falha ao instalar o ODA File Converter automaticamente. Continuando sem ele..."
    fi
else
    echo "  ✅ ODA File Converter já está instalado e ativo!"
fi
set -e # Restaura o comportamento rígido de erro do script
echo ""

echo "⚙️ Verificando motor de conversão de CAD (QCAD)..."
if [ ! -f "/opt/qcad/dwg2svg" ]; then
    echo "  ⚠️ Motor QCAD não encontrado. Baixando e instalando o QCAD automaticamente (aguarde ~30s)..."
    cd /tmp
    rm -f qcad-3.30.1-trial-linux-x86_64.tar.gz
    wget -q https://www.qcad.org/archives/qcad/qcad-3.30.1-trial-linux-x86_64.tar.gz

    mkdir -p /opt
    rm -rf /opt/qcad
    tar -xzf qcad-3.30.1-trial-linux-x86_64.tar.gz -C /opt/
    mv /opt/qcad-3.30.1-trial-linux-x86_64 /opt/qcad
    rm -f qcad-3.30.1-trial-linux-x86_64.tar.gz

    # Criar link simbólico
    ln -sf /opt/qcad/dwg2svg /usr/bin/dwg2svg
    chmod +x /opt/qcad/dwg2svg

    if [ -f "/opt/qcad/dwg2svg" ]; then
        echo "  ✅ QCAD (dwg2svg) instalado e ativado com sucesso em /opt/qcad!"
    else
        echo "  ❌ AVISO: Falha ao instalar o QCAD automaticamente."
    fi
else
    echo "  ✅ Motor QCAD já está instalado e ativo em /opt/qcad!"
fi
echo ""

# ─── 1. Parar PM2 ───
echo "[1/8] Parando serviços PM2..."
pm2 stop all 2>/dev/null && echo "  Serviços parados!" || echo "  PM2 não estava rodando (ok)"
echo ""

# ─── 2. Corrigir permissões da pasta ───
echo "[2/8] Corrigindo permissões da pasta do projeto..."
if [ -d "$PROJECT" ]; then
    chown -R roberto:roberto "$PROJECT"
    chmod -R 775 "$PROJECT"
    echo "  Permissões corrigidas!"
else
    echo "  Pasta não existe, será criada na extração"
    mkdir -p "$PROJECT"
    chown roberto:roberto "$PROJECT"
fi
echo ""

# ─── 3. Extrair novo código ───
echo "[3/8] Extraindo código atualizado..."
tar --warning=no-unknown-keyword -xzf "$TAR_CODE" -C "$PROJECT" --overwrite --no-same-permissions
rm -f "$TAR_CODE"
# Remover rota antiga duplicada para evitar conflito no Next.js
rm -rf "$PROJECT/src/app/(dashboard)/mapa"
echo "  Código extraído!"
echo ""

# ─── 4. Corrigir permissões pós-extração ───
echo "[4/8] Corrigindo permissões pós-extração..."
chown -R roberto:roberto "$PROJECT"
chmod -R 775 "$PROJECT"
echo "  Permissões garantidas!"
echo ""

# ─── 5. Migrar banco de dados ───
echo "[5/8] Verificando banco de dados..."
if [ -f "$DB_FILE" ]; then
    echo "  Validando integridade do banco SQLite enviado..."
    if ! sqlite3 "$DB_FILE" .tables | grep -q "User"; then
        echo "  ❌ ERRO: Banco inválido (tabela User ausente) — deploy abortado!"
        exit 1
    fi
    if ! sqlite3 "$DB_FILE" .tables | grep -q "Device"; then
        echo "  ❌ ERRO: Banco inválido (tabela Device ausente) — deploy abortado!"
        exit 1
    fi
    BACKUP="$PROJECT/prisma/dashboard.db.backup.$(date +%Y%m%d_%H%M%S)"
    [ -f "$PROJECT/prisma/dashboard.db" ] && cp "$PROJECT/prisma/dashboard.db" "$BACKUP" && echo "  Backup criado: $BACKUP"
    mv "$DB_FILE" "$PROJECT/prisma/dashboard.db"
    chown roberto:roberto "$PROJECT/prisma/dashboard.db"
    echo "  ✅ Banco validado e migrado com sucesso!"
else
    echo "  Banco não enviado em /tmp, mantendo banco atual do servidor"
fi
echo ""

# ─── 5.5 Atualizar variáveis do GLPI no .env.local ───
echo "[5.5/8] Configurando variáveis do GLPI no .env.local do servidor..."
ENV_LOCAL_FILE="$PROJECT/.env.local"
if [ ! -f "$ENV_LOCAL_FILE" ]; then
    touch "$ENV_LOCAL_FILE"
    chown roberto:roberto "$ENV_LOCAL_FILE"
fi
# Remove any existing GLPI variables to avoid duplicates
sed -i '/GLPI_/d' "$ENV_LOCAL_FILE"
# Append current valid GLPI config
echo "GLPI_API_URL=http://192.168.67.95/apirest.php" >> "$ENV_LOCAL_FILE"
echo "GLPI_USER=glpi" >> "$ENV_LOCAL_FILE"
echo "GLPI_PASSWORD=sumatra" >> "$ENV_LOCAL_FILE"
echo "GLPI_APP_TOKEN=eMFJC7JoQIRYJ8OjQSMc0x5MvHS6rdn1X7wFQ6ad" >> "$ENV_LOCAL_FILE"
echo "GLPI_DEFAULT_PROFILE_ID=1" >> "$ENV_LOCAL_FILE"
echo "  Variáveis do GLPI atualizadas no .env.local!"
echo ""

# ─── 6. npm install ───
echo "[6/8] Instalando dependências npm..."
cd "$PROJECT"
sudo -u roberto npm install --production=false --silent --legacy-peer-deps
echo "  Dependências instaladas!"
echo ""

# ─── 7. Prisma + Build ───
echo "[7/8] Prisma migrate + Build do Next.js (aguarde ~1 min)..."
cd "$PROJECT"
sudo -u roberto npx prisma db push --accept-data-loss
sudo -u roberto npx prisma generate
echo "  Limpando cache de compilação anterior..."
rm -rf .next
sudo -u roberto npm run build
echo "  Build concluído!"
echo ""

# ─── 8. Reiniciar PM2 ───
echo "[8/8] Reiniciando serviços PM2..."
cd "$PROJECT"
sudo -u roberto pm2 start ecosystem.config.js --update-env 2>/dev/null || true
sudo -u roberto pm2 restart zabbix-dashboard --update-env 2>/dev/null || true
sudo -u roberto pm2 restart kron-receiver --update-env 2>/dev/null || true
if sudo -u roberto pm2 list | grep -q "trap-receiver"; then
    sudo -u roberto pm2 restart trap-receiver --update-env 2>/dev/null || true
else
    if [ -f "/home/roberto/start-trap-receiver.sh" ]; then
        sudo -u roberto pm2 start /home/roberto/start-trap-receiver.sh --name trap-receiver --interpreter bash 2>/dev/null || true
    fi
fi
sudo -u roberto pm2 save
echo ""

# ─── Finalização ───
echo "========================================="
echo "  ✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!"
echo "  Acesse: http://$(hostname -I | awk '{print $1}'):3005"
echo "========================================="
echo ""
sudo -u roberto pm2 status
