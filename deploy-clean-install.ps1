# ============================================================
# deploy-clean-install.ps1
# INSTALACAO LIMPA E COMPLETA -- Ricas Dashboard
# Windows (192.168.67.82) -> Servidor Linux (192.168.67.94)
# Limpa toda a pasta antiga, reinstala dependencias do zero
# e restaura as configuracoes (.env.local) e banco de dados.
# ============================================================

$SERVER_IP   = "192.168.67.94"
$SERVER_USER = "roberto"
$TARGET      = "${SERVER_USER}@${SERVER_IP}"
$SERVER_PATH = "/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"

$LOCAL       = $PSScriptRoot
$STAGING     = "$env:TEMP\ricas_staging_clean"
$ZIP_LOCAL   = "$env:TEMP\ricas_deploy_clean.tar.gz"
$ZIP_REMOTE  = "/tmp/ricas_deploy_clean.tar.gz"
$DB_LOCAL    = "$LOCAL\prisma\dashboard.db"
$DB_REMOTE   = "/tmp/dashboard.db"

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host " 🚀 INSTALACAO LIMPA -- Ricas Tecnologia" -ForegroundColor White
Write-Host " Servidor: $SERVER_IP" -ForegroundColor Gray
Write-Host " Esse script fara uma limpeza e reinstalacao completa!" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Magenta

# ─── 1. TESTE DE CONECTIVIDADE ───
Write-Host "`n[1/6] Verificando conexao com o servidor..." -ForegroundColor Yellow
$alive = Test-Connection -ComputerName $SERVER_IP -Count 1 -Quiet
if (-not $alive) {
    Write-Host "  ERRO: Servidor $SERVER_IP nao responde!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Servidor alcancavel!" -ForegroundColor Green

# ─── 1.5. SINCRONIZAR ÍCONES PWA ───
Write-Host "`n[1.5/6] Sincronizando icones PWA..." -ForegroundColor Yellow
if (Test-Path "$LOCAL\scratch\copyIcon.js") {
    node "$LOCAL\scratch\copyIcon.js"
} else {
    Write-Host "  Aviso: copyIcon.js nao encontrado, ignorando copia de icones" -ForegroundColor Yellow
}

# ─── 2. PREPARAR CODIGO LOCAL EM TAR.GZ ───
Write-Host "`n[2/6] Preparando codigo limpo local..." -ForegroundColor Yellow

if (Test-Path $STAGING) { Remove-Item $STAGING -Recurse -Force }
New-Item -ItemType Directory -Path $STAGING -Force | Out-Null

Write-Host "  Copiando arquivos do projeto (excluindo caches, modulos e banco)..." -ForegroundColor Gray
robocopy $LOCAL $STAGING /E `
    /XD node_modules .next scratch .git `
    /XF "*.db" "*.db-journal" "*.db-wal" "*.db-shm" ".env.local" "*.tsbuildinfo" `
    /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

$fileCount = (Get-ChildItem $STAGING -Recurse -File).Count
Write-Host "  $fileCount arquivos preparados" -ForegroundColor Gray

if (Test-Path $ZIP_LOCAL) { Remove-Item $ZIP_LOCAL -Force }

# Compacta usando tar.exe nativo do Windows (preserva a estrutura de pastas perfeitamente para o Linux)
tar -czf "$ZIP_LOCAL" -C "$STAGING" .
$zipSize = [math]::Round((Get-Item $ZIP_LOCAL).Length / 1MB, 1)
Write-Host "  OK - Projeto compactado em TAR.GZ: $zipSize MB" -ForegroundColor Green

# ─── 3. ENVIAR TAR.GZ E BANCO DE DADOS ───
Write-Host "`n[3/6] Enviando TAR.GZ de codigo e Banco para o servidor..." -ForegroundColor Yellow

Write-Host "  Enviando TAR.GZ do codigo..." -ForegroundColor Gray
scp "$ZIP_LOCAL" "${TARGET}:${ZIP_REMOTE}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar o arquivo TAR.GZ!" -ForegroundColor Red
    exit 1
}

if (Test-Path $DB_LOCAL) {
    $dbSize = [math]::Round((Get-Item $DB_LOCAL).Length / 1MB, 2)
    Write-Host "  Enviando banco de dados local ($dbSize MB)..." -ForegroundColor Gray
    scp "$DB_LOCAL" "${TARGET}:${DB_REMOTE}"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  AVISO: Falha ao enviar banco de dados para o servidor!" -ForegroundColor Yellow
    } else {
        Write-Host "  OK - Banco de dados enviado com sucesso!" -ForegroundColor Green
    }
}

# ─── 4. CRIAR SCRIPT REMOTO DE INSTALACAO LIMPA ───
Write-Host "`n[4/6] Gerando script de instalacao limpa..." -ForegroundColor Yellow

$bashScript = "$env:TEMP\ricas_clean_install.sh"
$bashLines = @(
    "#!/bin/bash"
    "set -e"
    ""
    "# Limpa o proprio script temporario ao sair"
    "trap 'rm -f /tmp/ricas_clean_install.sh' EXIT"
    ""
    "PROJECT='/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard'"
    "BACKUP_DIR='/tmp/ricas_backup_temp'"
    ""
    "echo ''"
    "echo '========================================='"
    "echo '   INICIANDO INSTALACAO LIMPA NO LINUX'"
    "echo '========================================='"
    ""
    "echo ''"
    "echo '[1/8] Parando e removendo PM2 antigo...'"
    "pm2 delete zabbix-dashboard 2>/dev/null || true"
    "pm2 delete trap-receiver 2>/dev/null || true"
    "pm2 save --force 2>/dev/null || true"
    ""
    "echo ''"
    "echo '[2/8] Criando backup de seguranca local (.env.local)...'"
    "mkdir -p `"`$BACKUP_DIR`""
    "if [ -f `"`$PROJECT/.env.local`" ]; then"
    "    cp `"`$PROJECT/.env.local`" `"`$BACKUP_DIR/.env.local`""
    "    echo '  Configuracoes .env.local salvas!'"
    "else"
    "    echo '  Aviso: .env.local nao encontrado para backup'"
    "fi"
    ""
    "echo ''"
    "echo '[3/8] Renomeando pasta antiga (bypassando arquivos do root)...'"
    "if [ -d `"`$PROJECT`" ]; then"
    "    mv `"`$PROJECT`" `"`$PROJECT-old-`$(date +%Y%m%d_%H%M%S)`""
    "fi"
    "mkdir -p `"`$PROJECT`""
    "echo '  Pasta antiga movida e nova pasta limpa criada!'"
    ""
    "echo ''"
    "echo '[4/8] Extraindo novo codigo via TAR nativo do Linux...'"
    "tar -xzf /tmp/ricas_deploy_clean.tar.gz -C `"`$PROJECT`" --no-same-permissions"
    "rm -f /tmp/ricas_deploy_clean.tar.gz"
    "echo '  Codigo limpo extraido!'"
    ""
    "echo ''"
    "echo '[5/8] Restaurando configuracoes (.env.local) e Banco...'"
    "if [ -f `"`$BACKUP_DIR/.env.local`" ]; then"
    "    cp `"`$BACKUP_DIR/.env.local`" `"`$PROJECT/.env.local`""
    "    echo '  Configuracoes (.env.local) restauradas com sucesso!'"
    "else"
    "    echo '  Nao havia backup de .env.local. Certifique-se de cria-lo no servidor!'"
    "fi"
    "rm -rf `"`$BACKUP_DIR`""
    ""
    "if [ -f /tmp/dashboard.db ]; then"
    "    echo '  Validando integridade do banco SQLite enviado...'"
    "    if ! sqlite3 /tmp/dashboard.db .tables | grep -q User; then"
    "        echo '  ❌ ERRO: O arquivo dashboard.db enviado nao e valido (tabela User ausente)!'"
    "        echo '  Deploy abortado para proteger o banco de producao.'"
    "        exit 1"
    "    fi"
    "    if ! sqlite3 /tmp/dashboard.db .tables | grep -q Device; then"
    "        echo '  ❌ ERRO: O arquivo dashboard.db enviado nao e valido (tabela Device ausente)!'"
    "        echo '  Deploy abortado para proteger o banco de producao.'"
    "        exit 1"
    "    fi"
    "    mkdir -p `"`$PROJECT/prisma`""
    "    mv /tmp/dashboard.db `"`$PROJECT/prisma/dashboard.db`""
    "    chmod 755 `"`$PROJECT/prisma/dashboard.db`""
    "    echo '  Banco de dados local do Windows validado e restaurado com sucesso!'"
    "else"
    "    echo '  Banco nao encontrado em /tmp, criando banco vazio no Prisma'"
    "fi"
    "chmod -R 755 `"`$PROJECT`""
    ""
    "echo ''"
    "echo '[6/8] Instalando dependencias completas do zero...'"
    "cd `"`$PROJECT`""
    "npm cache clean --force"
    "npm install --production=false --legacy-peer-deps"
    "echo '  Dependencias instaladas!'"
    ""
    "echo ''"
    "echo '[7/8] Sincronizando Banco de Dados e Prisma...'"
    "npx prisma db push --accept-data-loss"
    "npx prisma generate"
    "echo '  Prisma Client gerado!'"
    ""
    "echo ''"
    "echo '[8/8] Compilando aplicacao Next.js (Gerando CSS/Tailwind)...'"
    "npm run build"
    "echo '  Next.js build finalizado!'"
    ""
    "echo ''"
    "echo '========================================='"
    "echo '   CONFIGURANDO AUTHBIND (PORTA 162)'"
    "echo '========================================='"
    "apt-get install -y authbind -q 2>/dev/null || true"
    "touch /etc/authbind/byport/162"
    "chown roberto:roberto /etc/authbind/byport/162"
    "chmod 500 /etc/authbind/byport/162"
    "systemctl stop snmptrapd 2>/dev/null || true"
    "systemctl disable snmptrapd 2>/dev/null || true"
    "echo '  authbind configurado - trap-receiver pode escutar porta 162!'"
    ""
    "echo ''"
    "echo '========================================='"
    "echo '   REINICIANDO SERVICOS PM2'"
    "echo '========================================='"
    "pm2 start ecosystem.config.js --update-env"
    "pm2 save"
    ""
    "echo ''"
    "echo '========================================='"
    "echo ' INSTALACAO LIMPA CONCLUIDA COM SUCESSO!'"
    "echo '========================================='"
    "pm2 status"
)

# Junta com LF (Unix) e salva sem BOM
$bashText = $bashLines -join "`n"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($bashScript, $bashText, $utf8NoBom)

scp "$bashScript" "${TARGET}:/tmp/ricas_clean_install.sh"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar script de instalacao!" -ForegroundColor Red
    exit 1
}

# ─── 5. EXECUTA A INSTALACAO LIMPA NO SERVIDOR ───
Write-Host "`n[5/6] Executando instalacao limpa no servidor (3-4 minutos)..." -ForegroundColor Yellow
Write-Host "  Esta etapa reinstala e compila tudo do zero. Aguarde..." -ForegroundColor Gray

ssh $TARGET "bash /tmp/ricas_clean_install.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n  ERRO: A instalacao limpa falhou no servidor." -ForegroundColor Red
    Write-Host "  Execute: ssh roberto@${SERVER_IP}" -ForegroundColor Gray
    Write-Host "  E verifique os logs na pasta do projeto." -ForegroundColor Gray
    exit 1
}

# ─── 6. LIMPEZA DE ARQUIVOS TEMPORARIOS ───
Write-Host "`n[6/6] Limpando arquivos temporarios locais..." -ForegroundColor Yellow
Remove-Item $STAGING   -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $ZIP_LOCAL -Force -ErrorAction SilentlyContinue
Remove-Item $bashScript -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  INSTALACAO E DEPLOY CONCLUIDOS DO ZERO!" -ForegroundColor Green
Write-Host "  Acesse: http://${SERVER_IP}:3005" -ForegroundColor White
Write-Host "  Verifique o PM2: pm2 status no servidor" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
