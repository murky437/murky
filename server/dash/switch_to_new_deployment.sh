#!/bin/bash
set -e

cd "$(dirname "$0")"

CYAN='\033[0;36m'
NC='\033[0m'  # No Color / reset

info() {
    echo "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')][server]${NC} $*"
}
err() {
    echo "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')][server]${NC} ${RED}$*${NC}"
}

info "##1 Moving current deployment to previous deployments directory"
if [ -f deployments/current/deploy.json ]; then
  timestamp=$(jq -r '.timestamp' deployments/current/deploy.json)
  rsync -av --delete --mkpath deployments/current/ "deployments/previous/${timestamp}/"
fi

info "##2 Moving new deployment to current deployment directory"
rsync -av --delete --mkpath deployments/new/ deployments/current/
rm -rf deployments/new
