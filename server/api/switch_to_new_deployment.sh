#!/bin/bash
set -e

cd "$(dirname "$0")"

source functions.sh

if [ ! -f deployments/new/deploy.json ] || [ ! -f deployments/new/api ]; then
  err "ERROR: new deployment is missing required files"
fi

info "Copying current database to new deployment"
mkdir -p deployments/new/db
if [ -f deployments/current/db/db.sqlite3 ]; then
    sqlite3 deployments/current/db/db.sqlite3 ".backup 'deployments/new/db/db.sqlite3'"
fi

info "Moving current deployment to previous deployments directory"
if [ -f deployments/current/deploy.json ]; then
  timestamp=$(jq -r '.timestamp' deployments/current/deploy.json)
  rsync -a --delete --mkpath deployments/current/ "deployments/previous/${timestamp}/"
fi

info "Moving new deployment to current deployment directory"
rsync -a --delete --mkpath deployments/new/ deployments/current/
rm -rf deployments/new

info "Reloading with docker compose"
docker compose up -d --build

info "Switch complete"
