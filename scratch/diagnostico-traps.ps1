#!/usr/bin/env powershell
# =====================================================
# diagnostico-traps.ps1
# Diagnostica o recebimento de traps SNMP no Ubuntu
# =====================================================

$SERVER = "roberto@192.168.67.94"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   DIAGNÓSTICO DE TRAPS SNMP - Ricas NOC    " -ForegroundColor White
Write-Host "   Servidor: 192.168.67.94                  " -ForegroundColor Gray
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/6] Status do PM2..." -ForegroundColor Yellow
ssh $SERVER "pm2 status"

Write-Host ""
Write-Host "[2/6] Verificando se a porta 162 está sendo escutada..." -ForegroundColor Yellow
ssh $SERVER "sudo ss -tuln | grep 162 || echo '❌ PORTA 162 NAO ESTA ABERTA!'"

Write-Host ""
Write-Host "[3/6] Últimas 50 linhas do log do trap-receiver..." -ForegroundColor Yellow
ssh $SERVER "pm2 logs trap-receiver --lines 50 --nostream 2>/dev/null || pm2 log trap-receiver --lines 50 2>/dev/null || journalctl -u trap-receiver --lines 50 2>/dev/null || echo 'Não foi possível obter logs'"

Write-Host ""
Write-Host "[4/6] Verificando permissões na porta 162 (authbind)..." -ForegroundColor Yellow
ssh $SERVER "ls -la /etc/authbind/byport/162 2>/dev/null || echo '❌ authbind NAO CONFIGURADO para porta 162'"
ssh $SERVER "which authbind 2>/dev/null || echo '❌ authbind nao instalado'"

Write-Host ""
Write-Host "[5/6] Testando se há outro processo ocupando a porta 162..." -ForegroundColor Yellow
ssh $SERVER "sudo lsof -i UDP:162 2>/dev/null || sudo fuser 162/udp 2>/dev/null || echo 'Nenhum processo usando porta 162'"

Write-Host ""
Write-Host "[6/6] Verificando firewall (ufw)..." -ForegroundColor Yellow
ssh $SERVER "sudo ufw status | grep -E '162|snmp|SNMP' 2>/dev/null || echo 'Regra 162 não encontrada no UFW'"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "   DIAGNÓSTICO CONCLUÍDO                    " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
