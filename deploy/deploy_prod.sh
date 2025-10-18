#!/bin/bash
set -e

cd "$(dirname "$0")"

source functions.sh

HOST=murky  # SSH host alias from ~/.ssh/config

if [ ! -d prod/api ]; then
  err "Missing prod/api, run the build script first"
  exit 1
fi

if [ ! -d prod/dash ]; then
  err "Missing prod/dash, run the build script first"
  exit 1
fi

info "Syncing new deployments to prod server"
rsync -a --delete --mkpath prod/api/ "$HOST:/var/www/murky/server/api/deployments/new/"
rsync -a --delete --mkpath prod/dash/ "$HOST:/var/www/murky/server/dash/deployments/new/"

info "Switching api to new deployment"
ssh "$HOST" 'bash /var/www/murky/server/api/switch_to_new_deployment.sh'

info "Switching dash to new deployment"
ssh "$HOST" 'bash /var/www/murky/server/dash/switch_to_new_deployment.sh'

info "Deploy complete"
