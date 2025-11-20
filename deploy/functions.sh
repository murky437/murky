#!/bin/bash

BLACK='\033[0;30m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'
NC='\033[0m' # No Color

info() {
    echo -e "${MAGENTA}[$(date '+%Y-%m-%d %H:%M:%S')][local]${NC} $*"
}

err() {
    echo "${MAGENTA}[$(date '+%Y-%m-%d %H:%M:%S')][server]${NC} ${RED}$*${NC}"
}

build() {
  env="$1"

  info "Creating new builds"
  docker compose -f "../docker-compose.$env.yml" run --rm --build api
  docker compose -f "../docker-compose.$env.yml" run --rm --build dash


  info "Removing old deployment directory"
  rm -rf "./$env"

  info "Moving new builds to new deployment directories"
  mkdir -p "$env/api"
  cp ../api/build/api "$env/api"
  mkdir -p "$env/dash"
  cp -r ../dash/dist/* "$env/dash"

  info "Adding deploy.json file for info"
  jq -n --arg commit "$(git rev-parse --short HEAD)" \
        --arg timestamp "$(date '+%Y%m%dT%H%M%S')" \
        '{commit: $commit, timestamp: $timestamp}' > "$env/api/deploy.json"
  cp "$env/api/deploy.json" "$env/dash/deploy.json"

  info "Build complete"
}
