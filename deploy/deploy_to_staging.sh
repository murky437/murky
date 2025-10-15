#!/bin/bash
set -e

MAGENTA='\033[0;35m'
NC='\033[0m'  # No Color / reset

info() {
    echo "${MAGENTA}[$(date '+%Y-%m-%d %H:%M:%S')][local]${NC} $*"
}


info "#1 Syncing new deployments to staging directory"
rsync -av --delete --mkpath api/ ../server/api/deployments/new/
rsync -av --delete --mkpath dash/ ../server/dash/deployments/new/

info "#2 Syncing migrations to staging directory"
rsync -av --delete --mkpath ../api/migrations/ ../server/api/migrations/

info "#3 Switching api to new deployment"
sh ../server/api/switch_to_new_deployment.sh

info "#4 Switching dash to new deployment"
sh ../server/dash/switch_to_new_deployment.sh
