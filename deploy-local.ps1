# ============================================================
# deploy-local.ps1
# DEPLOY COMPLETO -- Ricas Dashboard (Windows -> Linux)
# Migra: codigo + banco de dados + configuracoes
# Windows: 192.168.67.82   Servidor: 192.168.67.94
# ============================================================

$SERVER_IP   = "192.168.67.94"
$SERVER_USER = "roberto"
$TARGET      = "${SERVER_USER}@${SERVER_IP}"
$SERVER_PATH = "/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"

$LOCAL       = $PSScriptRoot
$STAGING     = "$env:TEMP\ricas_staging_full"
$ZIP_LOCAL   = "$env:TEMP\ricas_deploy_full.tar.gz"
$ZIP_REMOTE  = "/tmp/ricas_deploy.tar.gz"
$DB_LOCAL    = "$LOCAL\prisma\dashboard.db"
$DB_REMOTE   = "/tmp/dashboard.db"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  DEPLOY COMPLETO -- Ricas Dashboard" -ForegroundColor White
Write-Host "  Codigo + Banco de Dados + Tudo" -ForegroundColor Gray
Write-Host "  Destino: $SERVER_IP" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Cyan

# ─── 1. TESTE DE CONECTIVIDADE ───
Write-Host "`n[1/5] Verificando conexao com o servidor..." -ForegroundColor Yellow
$alive = Test-Connection -ComputerName $SERVER_IP -Count 1 -Quiet
if (-not $alive) {
    Write-Host "  ERRO: Servidor $SERVER_IP nao responde!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Servidor alcancavel!" -ForegroundColor Green

# ─── 1.5. SINCRONIZAR ÍCONES PWA ───
Write-Host "`n[1.5/5] Sincronizando icones PWA..." -ForegroundColor Yellow
if (Test-Path "$LOCAL\scratch\copyIcon.js") {
    node "$LOCAL\scratch\copyIcon.js"
} else {
    Write-Host "  Aviso: copyIcon.js nao encontrado, ignorando copia de icones" -ForegroundColor Yellow
}

# ─── 2. PREPARAR E COMPACTAR O PROJETO EM TAR.GZ ───
Write-Host "`n[2/5] Preparando projeto completo para envio..." -ForegroundColor Yellow

if (Test-Path $STAGING) { Remove-Item $STAGING -Recurse -Force }
New-Item -ItemType Directory -Path $STAGING -Force | Out-Null

Write-Host "  Copiando projeto (excluindo node_modules, .next, scratch)..." -ForegroundColor Gray

robocopy $LOCAL $STAGING /E `
    /XD node_modules .next scratch .git `
    /XF "*.db" "*.db-journal" "*.db-wal" "*.db-shm" ".env.local" "*.tsbuildinfo" "os.json" `
    /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null

$fileCount = (Get-ChildItem $STAGING -Recurse -File).Count
Write-Host "  $fileCount arquivos preparados" -ForegroundColor Gray

if (Test-Path $ZIP_LOCAL) { Remove-Item $ZIP_LOCAL -Force }

# Compacta usando tar.exe nativo do Windows (preserva a estrutura de pastas perfeitamente para o Linux)
tar -czf "$ZIP_LOCAL" -C "$STAGING" .
$zipSize = [math]::Round((Get-Item $ZIP_LOCAL).Length / 1MB, 1)
Write-Host "  OK - Projeto compactado em TAR.GZ: $zipSize MB" -ForegroundColor Green

# ─── 3. ENVIAR APENAS CODIGO (PROTEGE O BANCO DE PRODUÇÃO) ───
Write-Host "`n[3/5] Enviando arquivos para o servidor..." -ForegroundColor Yellow

Write-Host "  Enviando codigo ($zipSize MB)..." -ForegroundColor Gray
scp "$ZIP_LOCAL" "${TARGET}:${ZIP_REMOTE}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar o TAR.GZ de codigo!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Codigo enviado!" -ForegroundColor Green

Write-Host "  🛡️ PROTEÇÃO ATIVA: O banco de dados local NÃO será enviado para não sobrescrever os dados de produção do Ubuntu!" -ForegroundColor Cyan

# ─── 4. CRIAR SCRIPT REMOTO SEM BOM ───
Write-Host "`n[4/5] Enviando script de atualizacao para o Ubuntu..." -ForegroundColor Yellow

$bashScript = "$env:TEMP\update-server.sh"
$bashLines = @(
    "#!/bin/bash"
    "# ============================================================"
    "# update-server.sh"
    "# Script de Atualização Interativo (Rodar com sudo no Ubuntu)"
    "# ============================================================"
    "set -e"
    ""
    "if [ `"`$EUID`" -ne 0 ]; then"
    "  echo '❌ ERRO: Por favor, execute este script utilizando sudo!'"
    "  echo 'Exemplo: sudo bash update-server.sh'"
    "  exit 1"
    "fi"
    ""
    "PROJECT='/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard'"
    "ZIP_FILE='/tmp/ricas_deploy.tar.gz'"
    ""
    "echo ''"
    "echo '========================================='"
    "echo '   INICIANDO ATUALIZAÇÃO COMPLETA RICAS  '"
    "echo '========================================='"
    "echo ''"
    ""
    "echo '[1/6] Parando servicos PM2...'"
    "sudo -u roberto env PATH=`$PATH pm2 stop all 2>/dev/null || true"
    ""
    "echo '[2/6] Extraindo novo codigo (superando bloqueios de permissao)...'"
    "if [ -f `"`$ZIP_FILE`" ]; then"
    "    mkdir -p `"`$PROJECT`""
    "    tar --warning=no-unknown-keyword -xzf `"`$ZIP_FILE`" -C `"`$PROJECT`" --overwrite --no-same-permissions"
    "    rm -f `"`$ZIP_FILE`""
    "    echo '  Código extraído com sucesso!'"
    "else"
    "    echo '❌ ERRO: Arquivo ZIP não encontrado!'"
    "    exit 1"
    "fi"
    ""
    "echo '[3/6] Ajustando permissoes (chown roberto)...'"
    "chown -R roberto:roberto `"`$PROJECT`""
    "chmod -R 755 `"`$PROJECT`""
    "echo '  Permissões corrigidas!'"
    ""
    "echo '[3.5/6] Configurando variaveis do GLPI no .env.local...'"
    "ENV_LOCAL_FILE=`"`$PROJECT/.env.local`""
    "touch `"`$ENV_LOCAL_FILE`""
    "chown roberto:roberto `"`$ENV_LOCAL_FILE`""
    "sed -i '/GLPI_/d' `"`$ENV_LOCAL_FILE`""
    "echo 'GLPI_API_URL=http://192.168.67.95/apirest.php' >> `"`$ENV_LOCAL_FILE`""
    "echo 'GLPI_USER=glpi' >> `"`$ENV_LOCAL_FILE`""
    "echo 'GLPI_PASSWORD=sumatra' >> `"`$ENV_LOCAL_FILE`""
    "echo 'GLPI_APP_TOKEN=eMFJC7JoQIRYJ8OjQSMc0x5MvHS6rdn1X7wFQ6ad' >> `"`$ENV_LOCAL_FILE`""
    "echo 'GLPI_DEFAULT_PROFILE_ID=1' >> `"`$ENV_LOCAL_FILE`""
    "echo '  Variáveis do GLPI atualizadas no .env.local!'"
    ""
    "echo '[4/6] Instalando dependencias e Prisma como roberto...'"
    "sudo -u roberto env PATH=`$PATH bash -c `"export NVM_DIR='/home/roberto/.nvm' && [ -s '\\\$NVM_DIR/nvm.sh' ] && . '\\\$NVM_DIR/nvm.sh'; cd '$PROJECT' && npm install --silent --legacy-peer-deps`""
    "sudo -u roberto env PATH=`$PATH bash -c `"export NVM_DIR='/home/roberto/.nvm' && [ -s '\\\$NVM_DIR/nvm.sh' ] && . '\\\$NVM_DIR/nvm.sh'; cd '$PROJECT' && npx prisma db push --accept-data-loss`""
    "sudo -u roberto env PATH=`$PATH bash -c `"export NVM_DIR='/home/roberto/.nvm' && [ -s '\\\$NVM_DIR/nvm.sh' ] && . '\\\$NVM_DIR/nvm.sh'; cd '$PROJECT' && npx prisma generate`""
    ""
    "echo '[5/6] Gerando build do Next.js...'"
    "sudo -u roberto env PATH=`$PATH bash -c `"export NVM_DIR='/home/roberto/.nvm' && [ -s '\\\$NVM_DIR/nvm.sh' ] && . '\\\$NVM_DIR/nvm.sh'; cd '$PROJECT' && npm run build`""
    ""
    "echo '[6/6] Reiniciando servicos PM2...'"
    "# Garantir authbind configurado para porta 162 (unico setup necessario, idempotente)"
    "if ! [ -f /etc/authbind/byport/162 ]; then"
    "  echo '  [authbind] Configurando permissao para porta 162...'"
    "  apt-get install -y authbind -q 2>/dev/null || true"
    "  touch /etc/authbind/byport/162"
    "  chown roberto:roberto /etc/authbind/byport/162"
    "  chmod 500 /etc/authbind/byport/162"
    "  echo '  [authbind] Porta 162 liberada!'"
    "else"
    "  echo '  [authbind] Permissao para porta 162 ja configurada.'"
    "fi"
    "systemctl stop snmptrapd 2>/dev/null || true"
    "systemctl disable snmptrapd 2>/dev/null || true"
    "# Recriar o wrapper do trap-receiver com permissao de porta 162"
    "echo '#!/bin/bash' > /home/roberto/start-trap-receiver.sh"
    "echo 'export NVM_DIR=/home/roberto/.nvm' >> /home/roberto/start-trap-receiver.sh"
    "echo '. `$NVM_DIR/nvm.sh 2>/dev/null' >> /home/roberto/start-trap-receiver.sh"
    "echo 'cd /home/roberto/Projeto\ NOVO\ ZABBIX/zabbix-dashboard' >> /home/roberto/start-trap-receiver.sh"
    "echo 'exec authbind --deep node trapReceiver.mjs' >> /home/roberto/start-trap-receiver.sh"
    "chown roberto:roberto /home/roberto/start-trap-receiver.sh && chmod +x /home/roberto/start-trap-receiver.sh"
    "su - roberto -c 'pm2 restart zabbix-dashboard --update-env 2>/dev/null || true'"
    "su - roberto -c 'pm2 restart kron-receiver --update-env 2>/dev/null || true'"
    "su - roberto -c 'pm2 delete trap-receiver 2>/dev/null || true'"
    "su - roberto -c 'pm2 start /home/roberto/start-trap-receiver.sh --name trap-receiver --interpreter bash'"
    "su - roberto -c 'pm2 save'"
    ""
    "echo ''"
    "echo '========================================='"
    "echo '   ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!    '"
    "echo '========================================='"
    "sudo -u roberto env PATH=`$PATH bash -c `"export NVM_DIR='/home/roberto/.nvm' && [ -s '\\\$NVM_DIR/nvm.sh' ] && . '\\\$NVM_DIR/nvm.sh'; pm2 status`""
    ""
    "rm -f /tmp/update-server.sh"
)

# Junta com LF (Unix) e salva sem BOM
$bashText = $bashLines -join "`n"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($bashScript, $bashText, $utf8NoBom)

scp "$bashScript" "${TARGET}:/tmp/update-server.sh"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar script de atualizacao!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Script de atualizacao enviado!" -ForegroundColor Green

# Limpa temporarios
Remove-Item $STAGING   -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $ZIP_LOCAL -Force -ErrorAction SilentlyContinue
Remove-Item $bashScript -Force -ErrorAction SilentlyContinue

Write-Host "`n[5/5] PROCESSO CONCLUIDO NO WINDOWS!" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  OS ARQUIVOS JÁ ESTÃO NO SERVIDOR UBUNTU!" -ForegroundColor Green
Write-Host "  Agora acesse o Ubuntu e execute o script para fazer tudo:" -ForegroundColor White
Write-Host ""
Write-Host "  1. Acesse o SSH:" -ForegroundColor Yellow
Write-Host "     ssh roberto@$SERVER_IP" -ForegroundColor White
Write-Host ""
Write-Host "  2. Execute o script com sudo:" -ForegroundColor Yellow
Write-Host "     sudo bash /tmp/update-server.sh" -ForegroundColor White
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""
