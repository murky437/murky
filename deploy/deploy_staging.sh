#!/bin/bash
set -e

cd "$(dirname "$0")"

source functions.sh

info "Syncing new deployments to staging directory"
rsync -a --delete --mkpath staging/api/ ../server/api/deployments/new/
rsync -a --delete --mkpath staging/dash/ ../server/dash/deployments/new/

info "Switching api to new deployment"
bash ../server/api/switch_to_new_deployment.sh

info "Switching dash to new deployment"
bash ../server/dash/switch_to_new_deployment.sh

info "Deploy complete"
