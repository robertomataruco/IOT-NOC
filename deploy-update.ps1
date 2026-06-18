# ============================================================
# deploy-update.ps1
# ENVIO DE ATUALIZACAO DE CODIGO -- Ricas Dashboard
# Envia apenas os ARQUIVOS DE CODIGO para o servidor e atualiza
# MANTENDO OS DADOS DE PRODUCAO INTACTOS.
# ============================================================

$SERVER_IP   = "192.168.67.94"
$SERVER_USER = "roberto"
$TARGET      = "${SERVER_USER}@${SERVER_IP}"

$LOCAL       = $PSScriptRoot
$STAGING     = "$env:TEMP\ricas_staging_update"
$ZIP_LOCAL   = "$env:TEMP\ricas_update.tar.gz"
$ZIP_REMOTE  = "/tmp/ricas_deploy.tar.gz"
$SCRIPT_LOCAL    = "$LOCAL\update-server.sh"
$SCRIPT_REMOTE   = "/tmp/update-server.sh"
$BACKUP_LOCAL    = "$LOCAL\backup-system.sh"
$BACKUP_REMOTE   = "/tmp/backup-system.sh"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ENVIO DE ATUALIZACAO -- Ricas Dashboard" -ForegroundColor White
Write-Host "  Apenas empacota o CODIGO (preserva o Banco)" -ForegroundColor Gray
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

# ─── 2. PREPARAR E COMPACTAR ───
Write-Host "`n[2/4] Preparando e compactando projeto..." -ForegroundColor Yellow

# Remover rota duplicada antiga local para evitar conflito de compilação
if (Test-Path "$LOCAL\src\app\(dashboard)\mapa") {
    Remove-Item "$LOCAL\src\app\(dashboard)\mapa" -Recurse -Force | Out-Null
}

if (Test-Path $STAGING) { Remove-Item $STAGING -Recurse -Force }
New-Item -ItemType Directory -Path $STAGING -Force | Out-Null

Write-Host "  Copiando projeto (excluindo banco de dados local)..." -ForegroundColor Gray

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
Write-Host "`n[3/4] Enviando codigo para /tmp do servidor..." -ForegroundColor Yellow

scp "$ZIP_LOCAL" "${TARGET}:${ZIP_REMOTE}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar codigo!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Codigo enviado com sucesso! (Nenhum banco de dados foi sobrescrito)" -ForegroundColor Green

# Garantir que um banco vazio de /tmp do envio passado anterior não seja usado sem querer
ssh $TARGET "rm -f /tmp/dashboard.db"

# ─── 4. ENVIAR SCRIPTS DO SERVIDOR ───
Write-Host "`n[4/4] Enviando scripts de atualizacao..." -ForegroundColor Yellow

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

foreach ($pair in @(
    @{ local = $SCRIPT_LOCAL;  remote = $SCRIPT_REMOTE;  label = "update-server.sh" },
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
Write-Host "  ATUALIZACAO ENVIADA COM SUCESSO!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Seu banco de producao continua seguro." -ForegroundColor White
Write-Host "  Para aplicar essa atualizacao de telas, rode no Ubuntu:" -ForegroundColor White
Write-Host ""
Write-Host "    bash /tmp/update-server.sh" -ForegroundColor Cyan
Write-Host ""
