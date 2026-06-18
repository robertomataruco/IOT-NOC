#!/bin/bash
# =======================================================
#  setup-https.sh — Configura HTTPS com Nginx no Ubuntu
#  Execute como ROOT: bash /tmp/setup-https.sh
# =======================================================

set -e

SERVER_IP="192.168.67.94"
APP_PORT="3005"
NGINX_CONF="/etc/nginx/sites-available/ricas-dashboard"
NGINX_ENABLED="/etc/nginx/sites-enabled/ricas-dashboard"
CERT_DIR="/etc/nginx/ssl/ricas"

echo ""
echo "========================================="
echo "  🔒 CONFIGURANDO HTTPS — RICAS TECNOLOGIA"
echo "========================================="
echo ""

# ─── 1. Instalar Nginx ───
echo "[1/6] Instalando Nginx..."
apt-get update -qq
apt-get install -y nginx openssl
systemctl enable nginx
echo "  Nginx instalado!"
echo ""

# ─── 2. Gerar Certificado SSL Autoassinado ───
echo "[2/6] Gerando certificado SSL autoassinado (válido por 10 anos)..."
mkdir -p "$CERT_DIR"

openssl req -x509 -nodes -days 3650 \
  -newkey rsa:2048 \
  -keyout "$CERT_DIR/server.key" \
  -out    "$CERT_DIR/server.crt" \
  -subj "/C=BR/ST=SP/L=SaoPaulo/O=RicasTecnologia/OU=TI/CN=$SERVER_IP" \
  -addext "subjectAltName=IP:$SERVER_IP"

chmod 600 "$CERT_DIR/server.key"
chmod 644 "$CERT_DIR/server.crt"
echo "  Certificado gerado em $CERT_DIR"
echo ""

# ─── 3. Criar configuração do Nginx ───
echo "[3/6] Criando configuração do Nginx..."
cat > "$NGINX_CONF" << 'NGINX_EOF'
# ──────────────────────────────────────────────
#  Ricas Tecnologia Dashboard — Nginx HTTPS
# ──────────────────────────────────────────────

# Redireciona HTTP → HTTPS
server {
    listen 80;
    server_name _;

    location / {
        return 301 https://$host$request_uri;
    }
}

# Servidor HTTPS principal
server {
    listen 443 ssl;
    server_name _;

    # ── Certificados SSL ──
    ssl_certificate     /etc/nginx/ssl/ricas/server.crt;
    ssl_certificate_key /etc/nginx/ssl/ricas/server.key;

    # ── Segurança TLS ──
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    # ── Headers de Segurança ──
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-Content-Type-Options nosniff;

    # ── Tamanho máximo de upload (para envio de banco de dados) ──
    client_max_body_size 512M;

    # ── Proxy para o Next.js ──
    location / {
        proxy_pass         http://127.0.0.1:3005;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
NGINX_EOF

echo "  Configuração criada!"
echo ""

# ─── 4. Ativar site no Nginx ───
echo "[4/6] Ativando site no Nginx..."
# Remove default se existir
[ -f /etc/nginx/sites-enabled/default ] && rm -f /etc/nginx/sites-enabled/default

# Cria link simbólico
ln -sf "$NGINX_CONF" "$NGINX_ENABLED"

# Valida configuração
nginx -t && echo "  Configuração validada com sucesso!"
echo ""

# ─── 5. Abrir portas no firewall ───
echo "[5/6] Configurando firewall (UFW)..."
if command -v ufw &>/dev/null; then
    ufw allow 80/tcp  2>/dev/null && echo "  Porta 80  (HTTP)  liberada"
    ufw allow 443/tcp 2>/dev/null && echo "  Porta 443 (HTTPS) liberada"
    echo "  Firewall configurado!"
else
    echo "  UFW não instalado — verifique o firewall manualmente se necessário"
fi
echo ""

# ─── 6. Reiniciar Nginx ───
echo "[6/6] Iniciando Nginx..."
systemctl restart nginx
systemctl status nginx --no-pager -l | head -5
echo ""

# ─── Resultado Final ───
echo "========================================="
echo "  ✅ HTTPS CONFIGURADO COM SUCESSO!"
echo ""
echo "  Acesse o dashboard em:"
echo "  👉  https://$SERVER_IP"
echo ""
echo "  IMPORTANTE — Primeira vez no navegador:"
echo "  O navegador mostrará aviso 'Conexão não segura'"
echo "  (normal para certificado autoassinado)"
echo ""
echo "  → No Chrome: clique em 'Avançado' → 'Acessar mesmo assim'"
echo "  → No celular: clique em 'Detalhes' → 'Visitar site'"
echo "  → Após aceitar UMA VEZ, o Chrome habilitará a"
echo "    instalação do PWA automaticamente!"
echo "========================================="
echo ""
echo "  Portas ativas:"
echo "    HTTP  :80  → redireciona para HTTPS"
echo "    HTTPS :443 → Nginx → Next.js :$APP_PORT"
echo ""
