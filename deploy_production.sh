#!/usr/bin/env bash

# ------------------------------------------------------------
# deploy_production.sh
# ------------------------------------------------------------
# Usage (run on the Ubuntu production server):
#   chmod +x deploy_production.sh
#   ./deploy_production.sh
# ------------------------------------------------------------

set -euo pipefail

# --- Configuration ------------------------------------------------
PROJECT_ROOT="/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"
DB_PATH="$PROJECT_ROOT/prisma/dashboard.db"
PM2_APP_NAME="zabbix-dashboard"
# ------------------------------------------------------------

# Helper to print colored messages
info() { echo -e "\e[34m[INFO]\e[0m $*"; }
error() { echo -e "\e[31m[ERROR]\e[0m $*"; }

# 1. Verify we are in the correct directory
info "Changing to project directory: $PROJECT_ROOT"
cd "$PROJECT_ROOT"

# 2. Preserve the current SQLite DB (just in case)
if [[ -f "$DB_PATH" ]]; then
  BACKUP="$PROJECT_ROOT/prisma/dashboard.db.backup_$(date +%Y%m%d_%H%M%S)"
  info "Backing up existing DB to $BACKUP"
  cp "$DB_PATH" "$BACKUP"
else
  error "Database file not found at $DB_PATH – checking fallback in project root..."
  FALLBACK_DB="$PROJECT_ROOT/dashboard.db"
  if [[ -f "$FALLBACK_DB" ]]; then
    BACKUP="$PROJECT_ROOT/dashboard.db.backup_$(date +%Y%m%d_%H%M%S)"
    info "Found DB in project root. Backing up and copying to $DB_PATH"
    cp "$FALLBACK_DB" "$BACKUP"
    # Ensure prisma directory exists and copy there
    mkdir -p "$PROJECT_ROOT/prisma"
    cp "$FALLBACK_DB" "$DB_PATH"
  else
    error "No database found at either $DB_PATH or $FALLBACK_DB – will be created fresh by migration."
  fi
fi

# 3. Install / update npm dependencies (using --legacy-peer-deps to avoid conflicts)
info "Installing npm dependencies with legacy peer deps"
npm install --legacy-peer-deps --prefer-offline

# 4. Ensure Prisma client is generated and DB schema is up‑to‑date
info "Running Prisma generate"
npx prisma generate

info "Synchronizing database schema (db push)"
npx prisma db push --accept-data-loss

# 5. Build the Next.js app for production
info "Building Next.js (next build)"
npm run build

# 6. Restart the PM2 process (or start it if it does not exist)
if pm2 list | grep -q "$PM2_APP_NAME"; then
  info "Restarting PM2 process: $PM2_APP_NAME"
  pm2 restart "$PM2_APP_NAME"
else
  info "Starting PM2 process for the first time"
  pm2 start "npm run start" --name "$PM2_APP_NAME"
fi

info "Deployment completed successfully!"

# End of script
