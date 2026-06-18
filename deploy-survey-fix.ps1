# ============================================================
# deploy-survey-fix.ps1
# Envia APENAS o SurveyClient.tsx corrigido e reconstrói
# ============================================================

$SERVER_IP   = "192.168.67.94"
$SERVER_USER = "roberto"
$TARGET      = "${SERVER_USER}@${SERVER_IP}"
$LOCAL_FILE  = "$PSScriptRoot\src\app\(dashboard)\admin\survey\SurveyClient.tsx"
$REMOTE_FILE = "/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard/src/app/(dashboard)/admin/survey/SurveyClient.tsx"
$REMOTE_DIR  = "/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  PATCH CIRURGICO -- SurveyClient.tsx" -ForegroundColor White
Write-Host "  Destino: $SERVER_IP"                 -ForegroundColor Gray
Write-Host "======================================" -ForegroundColor Cyan

# 1. Verificar que o arquivo local existe
if (-not (Test-Path $LOCAL_FILE)) {
    Write-Host "ERRO: Arquivo local nao encontrado: $LOCAL_FILE" -ForegroundColor Red
    exit 1
}
Write-Host "`n[1/3] Arquivo local encontrado ($([math]::Round((Get-Item $LOCAL_FILE).Length/1KB,1)) KB)" -ForegroundColor Green

# 2. Converter CRLF -> LF e enviar via SCP
Write-Host "[2/3] Enviando SurveyClient.tsx para o servidor..." -ForegroundColor Yellow
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$content   = Get-Content $LOCAL_FILE -Raw
$content   = $content -replace "`r`n", "`n"
$tmpFile   = "$env:TEMP\SurveyClient_patch.tsx"
[System.IO.File]::WriteAllText($tmpFile, $content, $utf8NoBom)

scp "$tmpFile" "${TARGET}:${REMOTE_FILE}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao enviar arquivo!" -ForegroundColor Red
    exit 1
}
Remove-Item $tmpFile -Force -ErrorAction SilentlyContinue
Write-Host "  OK - Arquivo enviado!" -ForegroundColor Green

# 3. Rebuild remoto
Write-Host "[3/3] Reconstruindo Next.js no servidor (aguarde ~1 min)..." -ForegroundColor Yellow
ssh $TARGET "cd '$REMOTE_DIR' && sudo -u roberto npm run build 2>&1 | tail -20"

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "  PATCH CONCLUIDO!" -ForegroundColor Green
Write-Host "  Se o build passou, reinicie o PM2:" -ForegroundColor White
Write-Host "  pm2 restart all" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Green
