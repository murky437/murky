#!/bin/bash
set -e

MAGENTA='\033[0;35m'
NC='\033[0m'  # No Color / reset

info() {
    echo "${MAGENTA}[$(date '+%Y-%m-%d %H:%M:%S')][local]${NC} $*"
}

info "#1 Creating new builds"
docker compose -f ../docker-compose.prod.yml up --build

info "#2 Removing old deployment directories"
rm -rf ./api ./dash

info "#3 Moving new builds to new deployment directories"
mkdir -p api
cp ../api/build/api api
cp ../api/build/migrate api
mkdir -p dash
cp -r ../dash/dist/* dash

info "#4 Adding deploy.json file for info"
jq -n --arg commit "$(git rev-parse --short HEAD)" \
      --arg timestamp "$(date '+%Y%m%dT%H%M%S')" \
      '{commit: $commit, timestamp: $timestamp}' > api/deploy.json
cp api/deploy.json dash/deploy.json


