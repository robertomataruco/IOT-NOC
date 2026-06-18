# ============================================================
# copy-glpi-logos.ps1
# Cópia de Logos e Ícones do NOC para o Servidor GLPI 11
# Windows -> GLPI Server: 192.168.67.95
# ============================================================

$SERVER_IP   = "192.168.67.95"
$SERVER_USER = "roberto"
$TARGET      = "${SERVER_USER}@${SERVER_IP}"

$LOCAL       = $PSScriptRoot
$PUBLIC      = "$LOCAL\public"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  ENVIANDO LOGOS E ÍCONES PARA O GLPI 11" -ForegroundColor White
Write-Host "  Destino: $SERVER_IP" -ForegroundColor Gray
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Verificar conectividade com o servidor GLPI
Write-Host "`n[1/2] Verificando conexão com o servidor GLPI..." -ForegroundColor Yellow
$alive = Test-Connection -ComputerName $SERVER_IP -Count 1 -Quiet
if (-not $alive) {
    Write-Host "  ERRO: Servidor GLPI ($SERVER_IP) não responde!" -ForegroundColor Red
    exit 1
}
Write-Host "  OK - Servidor GLPI alcançável!" -ForegroundColor Green

# 2. Enviar arquivos por SCP
Write-Host "`n[2/2] Enviando arquivos de imagem por SCP..." -ForegroundColor Yellow

$files = @(
    "logo-ricas-new.png",
    "logo-ricas.png",
    "icon-192x192.png",
    "icon-512x512.png"
)

foreach ($file in $files) {
    $filePath = "$PUBLIC\$file"
    if (Test-Path $filePath) {
        Write-Host "  Enviando $file..." -ForegroundColor Gray
        scp "$filePath" "${TARGET}:/tmp/$file"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  AVISO: Erro ao enviar $file!" -ForegroundColor Yellow
        } else {
            Write-Host "  OK - $file enviado para /tmp!" -ForegroundColor Green
        }
    } else {
        Write-Host "  AVISO: Arquivo $file não encontrado em public/" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  ARQUIVOS ENVIADOS COM SUCESSO PARA /tmp!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Agora, conecte-se ao servidor GLPI para copiar" -ForegroundColor White
Write-Host "  as imagens para a pasta de imagens pública do GLPI:" -ForegroundColor White
Write-Host ""
Write-Host "  1. Conectar via SSH:" -ForegroundColor Gray
Write-Host "     ssh roberto@192.168.67.95" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. Mover arquivos para o diretório de imagens do GLPI:" -ForegroundColor Gray
Write-Host "     sudo mkdir -p /var/www/glpi/public/pics/" -ForegroundColor Cyan
Write-Host "     sudo cp /tmp/logo-ricas-new.png /var/www/glpi/public/pics/" -ForegroundColor Cyan
Write-Host "     sudo cp /tmp/logo-ricas.png /var/www/glpi/public/pics/" -ForegroundColor Cyan
Write-Host "     sudo cp /tmp/icon-192x192.png /var/www/glpi/public/pics/" -ForegroundColor Cyan
Write-Host "     sudo chown -R www-data:www-data /var/www/glpi/public/pics/" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Após isso, você poderá configurar a logo em Administração -> Entidades" -ForegroundColor Gray
Write-Host "  (caso utilize o plugin Branding) ou apontando para os arquivos copiados." -ForegroundColor Gray
Write-Host ""
