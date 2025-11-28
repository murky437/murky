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
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')][server]${NC} $*"
}


deleteOldPreviousDeployments() {
  local BASE="./deployments/previous"

  local dirs
  dirs=$(printf "%s\n" "$BASE"/*/ | xargs --max-args=1 basename | sort --reverse)

  local latest3dirs
  latest3dirs=$(printf "%s\n" "$dirs" | head --lines=3)

  local timestampWeekAgo
  timestampWeekAgo=$(date --date="7 days ago" +"%Y%m%dT%H%M%S")
  local latestWeekDirs
  latestWeekDirs=$(printf "%s\n" "$dirs" | awk --assign c="$timestampWeekAgo" '$0 >= c')

  local keepDirs
  keepDirs=$(printf "%s\n%s\n" "$latest3dirs" "$latestWeekDirs" | sort --unique)

  local d
  for d in $dirs; do
    printf "%s\n" "$keepDirs" | grep --quiet --line-regexp "$d" || rm --recursive --force "${BASE:?}/$d"
  done
}
