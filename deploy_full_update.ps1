# Deploy Full Update - PowerShell script
# ------------------------------------------------------------
# Usage (run on Windows machine):
#   Set $ServerIp, $User, $RemotePath accordingly.
#   .\deploy_full_update.ps1
# ------------------------------------------------------------

$ServerIp = "192.168.67.94"
$User = "roberto"
$RemoteProjectPath = "/home/roberto/Projeto NOVO ZABBIX/zabbix-dashboard"
$DateStr = Get-Date -Format "yyyyMMdd_HHmmss"

# Paths on local machine (project root)
$LocalRoot = "C:\Users\rmataruco\OneDrive\Projeto NOVO ZABBIX\zabbix-dashboard"

# 1. Create a temporary tar of the whole project (excluding node_modules, .next, .git, scratch, and DB files for safety)
Write-Host "Creating project archive..."
$ArchivePath = "$env:TEMP\zabbix-dashboard.tar.gz"
if (Test-Path $ArchivePath) { Remove-Item $ArchivePath -Force }
# Use tar (assumes Windows 10+ includes tar)
& tar --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='scratch' --exclude='*.db' --exclude='*.db-journal' --exclude='*.db-shm' --exclude='*.db-wal' --exclude='.env' -czf $ArchivePath -C $LocalRoot .

# 2. Transfer archive via SCP
Write-Host "Transferring archive to $ServerIp..."
$Destination = "${User}@${ServerIp}:/tmp/"
# Requires OpenSSH client (scp) in PATH
& scp -r $ArchivePath $Destination

# 3. SSH into server, backup DB first, then extract and deploy
$sshCommands = @(
    "set -euo pipefail",
    "cd `"$RemoteProjectPath`"",
    "if [ -f dashboard.db ]; then cp dashboard.db dashboard.db.deploy_pre_backup_$DateStr; fi",
    "tar --overwrite -xzf /tmp/$(Split-Path $ArchivePath -Leaf) -C `"$RemoteProjectPath`"",
    "chmod +x deploy_production.sh",
    "sed -i 's/\r$//' deploy_production.sh",
    "./deploy_production.sh"
) -join "`n"

Write-Host "Executing remote deployment..."
$sshCommands | & ssh $User@$ServerIp "bash"

Write-Host "Deployment finished."
