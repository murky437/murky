#!/bin/bash
set -e

cd "$(dirname "$0")"

RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'  # No Color / reset

info() {
    echo "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')][server]${NC} $*"
}
err() {
    echo "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')][server]${NC} ${RED}$*${NC}"
}

if [ ! -f deployments/new/deploy.json ] || [ ! -f deployments/new/api ] || [ ! -f deployments/new/migrate ]; then
  err "ERROR: new deployment is missing required files"
fi

info "##1 Copying current database to new deployment"
mkdir -p deployments/new/db
if [ -f deployments/current/db/db.sqlite3 ]; then
    sqlite3 deployments/current/db/db.sqlite3 ".backup 'deployments/new/db/db.sqlite3'"
fi

info "##2 Running migrations"
deployments/new/migrate -db deployments/new/db/db.sqlite3 -migrations migrations

info "##3 Moving current deployment to previous deployments directory"
if [ -f deployments/current/deploy.json ]; then
  timestamp=$(jq -r '.timestamp' deployments/current/deploy.json)
  rsync -av --delete --mkpath deployments/current/ "deployments/previous/${timestamp}/"
fi

info "##4 Moving new deployment to current deployment directory"
rsync -av --delete --mkpath deployments/new/ deployments/current/
rm -rf deployments/new

info "##5 Reloading with docker compose"
docker compose up -d --build
