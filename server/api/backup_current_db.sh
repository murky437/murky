#!/bin/bash
set -e

cd "$(dirname "$0")"

source functions.sh

if [ ! -f deployments/current/backupdb ]; then
  err "ERROR: missing deployments/current/backupdb binary"
fi

info "Creating a backup of deployments/current/db/db.sqlite3 to database_backups directory"
deployments/current/backupdb deployments/current/db/db.sqlite3 database_backups

info "Backup complete"
