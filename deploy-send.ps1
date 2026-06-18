# ============================================================
# deploy-send.ps1
# ENVIO DE ARQUIVOS -- Ricas Dashboard (Windows -> Linux)
# So envia o codigo e o banco para o servidor.
# A ATUALIZACAO sera feita manualmente no Ubuntu como root.
# Windows: 192.168.67.82   Servidor: 192.168.67.94
# ============================================================

$SERVER_IP   = "192.168.67.94"
$SERVER_USER = "roberto"
$TARGET      = "${SERVER_USER}@${SERVER_IP}"

$LOCAL       = $PSScriptRoot
$STAGING     = "$env:TEMP\ricas_staging_full"
$ZIP_LOCAL   = "$env:TEMP\ricas_deploy_full.tar.gz"
$ZIP_REMOTE  = "/tmp/ricas_deploy.tar.gz"
$DB_LOCAL    = "$LOCAL\prisma\dashboard.db"
$DB_REMOTE   = "/tmp/dashboard.db"
$SCRIPT_LOCAL    = "$LOCAL\update-server.sh"
$SCRIPT_REMOTE   = "/tmp/update-server.sh"
$HTTPS_LOCAL     = "$LOCAL\setup-https.sh"
$HTTPS_REMOTE    = "/tmp/setup-https.sh"
$BACKUP_LOCAL    = "$LOCAL\backup-system.sh"
$BACKUP_REMOTE   = "/tmp/backup-system.sh"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ENVIO DE ARQUIVOS -- Ricas Dashboard" -ForegroundColor White
Write-Host "  Apenas empacota e envia para o servidor" -ForegroundColor Gray
Write-Host "  Destino: $SERVER_IP" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Cyan

# ─── 1. TESTE DE CONECTIVIDADE ───
Write-Host "`n[1/4] Verificando conexao com o servidor..." -ForegroundColor Yellow
$alive = Test-Connection -ComputerName $SERVER_IP -Count 1 -Quiet
if (-not $alive) {
    Write-Host "  ERRO: Servidor $SERVER_IP nao responde!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Servidor alcancavel!" -ForegroundColor Green

# ─── 1.5. SINCRONIZAR ICONES PWA ───
Write-Host "`n[1.5/4] Sincronizando icones PWA..." -ForegroundColor Yellow
if (Test-Path "$LOCAL\scratch\copyIcon.js") {
    node "$LOCAL\scratch\copyIcon.js"
} else {
    Write-Host "  Aviso: copyIcon.js nao encontrado, ignorando copia de icones" -ForegroundColor Yellow
}

# ─── 2. PREPARAR E COMPACTAR ───
Write-Host "`n[2/4] Preparando e compactando projeto..." -ForegroundColor Yellow

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
tar -czf "$ZIP_LOCAL" -C "$STAGING" .
$zipSize = [math]::Round((Get-Item $ZIP_LOCAL).Length / 1MB, 1)
Write-Host "  OK - Compactado em TAR.GZ: $zipSize MB" -ForegroundColor Green

# ─── 3. ENVIAR PARA O SERVIDOR ───
Write-Host "`n[3/4] Enviando arquivos para /tmp do servidor..." -ForegroundColor Yellow

Write-Host "  Enviando codigo ($zipSize MB)..." -ForegroundColor Gray
scp "$ZIP_LOCAL" "${TARGET}:${ZIP_REMOTE}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar codigo!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Codigo enviado!" -ForegroundColor Green

if (Test-Path $DB_LOCAL) {
    $dbSize = [math]::Round((Get-Item $DB_LOCAL).Length / 1MB, 2)
    Write-Host "  Enviando banco de dados ($dbSize MB)..." -ForegroundColor Gray
    scp "$DB_LOCAL" "${TARGET}:${DB_REMOTE}"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  AVISO: Erro ao enviar banco de dados!" -ForegroundColor Yellow
    } else {
        Write-Host "  OK - Banco de dados enviado!" -ForegroundColor Green
    }
} else {
    Write-Host "  AVISO: Banco de dados local nao encontrado" -ForegroundColor Yellow
}

# ─── 4. ENVIAR SCRIPTS DO SERVIDOR ───
Write-Host "`n[4/4] Enviando scripts para o servidor..." -ForegroundColor Yellow

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

foreach ($pair in @(
    @{ local = $SCRIPT_LOCAL;  remote = $SCRIPT_REMOTE;  label = "update-server.sh" },
    @{ local = $HTTPS_LOCAL;   remote = $HTTPS_REMOTE;   label = "setup-https.sh" },
    @{ local = $BACKUP_LOCAL;  remote = $BACKUP_REMOTE;  label = "backup-system.sh" }
)) {
    if (Test-Path $pair.local) {
        $content = Get-Content $pair.local -Raw
        $content = $content -replace "`r`n", "`n"
        $tmp = "$env:TEMP\$($pair.label)"
        [System.IO.File]::WriteAllText($tmp, $content, $utf8NoBom)
        scp "$tmp" "${TARGET}:$($pair.remote)"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ERRO ao enviar $($pair.label)!" -ForegroundColor Red
        } else {
            Write-Host "  OK - $($pair.label) enviado!" -ForegroundColor Green
        }
        Remove-Item $tmp -Force -ErrorAction SilentlyContinue
    } else {
        Write-Host "  AVISO: $($pair.label) nao encontrado" -ForegroundColor Yellow
    }
}

# ─── LIMPEZA LOCAL ───
Remove-Item $STAGING  -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item $ZIP_LOCAL -Force -ErrorAction SilentlyContinue

# ─── INSTRUCOES FINAIS ───
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  ARQUIVOS ENVIADOS COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  PROXIMOS PASSOS NO UBUNTU (como root):" -ForegroundColor White
Write-Host ""
Write-Host "  [Atualizar codigo/app]" -ForegroundColor Yellow
Write-Host "    bash /tmp/update-server.sh" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [Configurar HTTPS - apenas 1a vez]" -ForegroundColor Yellow
Write-Host "    bash /tmp/setup-https.sh" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Apos o HTTPS, acesse:" -ForegroundColor Gray
Write-Host "    https://192.168.67.94" -ForegroundColor White
Write-Host ""
