#!/usr/bin/env pwsh
# =====================================================
# deploy-fix-traps.ps1
# Envia o fix de traps para o servidor Ubuntu e executa.
# Resolve: porta 162 nao escutada / authbind nao configurado
# =====================================================

$SERVER_IP   = "192.168.67.94"
$SERVER_USER = "roberto"
$TARGET      = "${SERVER_USER}@${SERVER_IP}"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   DEPLOY FIX: TRAPS SNMP Ricas NOC        " -ForegroundColor White
Write-Host "   Servidor: $SERVER_IP                    " -ForegroundColor Gray
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# ─── 1. VERIFICAR CONECTIVIDADE ───
Write-Host "[1/4] Verificando conexao com o servidor..." -ForegroundColor Yellow
$alive = Test-Connection -ComputerName $SERVER_IP -Count 1 -Quiet
if (-not $alive) {
    Write-Host "  ERRO: Servidor $SERVER_IP nao responde!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Servidor alcancavel!" -ForegroundColor Green

# ─── 2. ENVIAR ARQUIVOS ATUALIZADOS ───
Write-Host ""
Write-Host "[2/4] Enviando arquivos atualizados..." -ForegroundColor Yellow

# Enviar o ecosystem.config.js atualizado (com trap-receiver + authbind)
$LOCAL = $PSScriptRoot
scp "$LOCAL\ecosystem.config.js" "${TARGET}:/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard/ecosystem.config.js"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar ecosystem.config.js!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - ecosystem.config.js enviado!" -ForegroundColor Green

# Enviar o script de fix
scp "$LOCAL\fix-traps-completo.sh" "${TARGET}:/tmp/fix-traps-completo.sh"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERRO ao enviar fix-traps-completo.sh!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Script de fix enviado!" -ForegroundColor Green

# ─── 3. EXECUTAR O FIX ───
Write-Host ""
Write-Host "[3/4] Executando fix no servidor Ubuntu..." -ForegroundColor Yellow
Write-Host "  (Precisara de senha sudo)" -ForegroundColor Gray
Write-Host ""

ssh $TARGET "sudo bash /tmp/fix-traps-completo.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "  AVISO: O script retornou um codigo de erro." -ForegroundColor Yellow
    Write-Host "  Verifique os logs acima para detalhes." -ForegroundColor Gray
}

# ─── 4. VERIFICACAO FINAL ───
Write-Host ""
Write-Host "[4/4] Verificacao final - Status do PM2 e porta 162..." -ForegroundColor Yellow
ssh $TARGET "
    export NVM_DIR='/home/roberto/.nvm'
    [ -s `"\$NVM_DIR/nvm.sh`" ] && . `"\$NVM_DIR/nvm.sh`"
    echo '--- PM2 STATUS ---'
    pm2 status
    echo ''
    echo '--- PORTA 162 ---'
    sudo ss -tuln | grep 162 && echo '✅ PORTA 162 ABERTA!' || echo '❌ Porta 162 nao encontrada'
"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "   DEPLOY FIX CONCLUIDO!                   " -ForegroundColor Green
Write-Host ""
Write-Host "   Para monitorar traps em tempo real, acesse" -ForegroundColor White
Write-Host "   o servidor e execute:                    " -ForegroundColor White
Write-Host "   pm2 logs trap-receiver                  " -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Green
