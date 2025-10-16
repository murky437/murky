#!/bin/bash
set -e

cd "$(dirname "$0")"

source functions.sh

info "Moving current deployment to previous deployments directory"
if [ -f deployments/current/deploy.json ]; then
  timestamp=$(jq -r '.timestamp' deployments/current/deploy.json)
  rsync -av --delete --mkpath deployments/current/ "deployments/previous/${timestamp}/"
fi

info "Moving new deployment to current deployment directory"
rsync -av --delete --mkpath deployments/new/ deployments/current/
rm -rf deployments/new

info "Switch complete"
