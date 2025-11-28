#!/bin/bash
set -eu

cd "$(dirname "$0")"

source functions.sh

latest_prev=$(find deployments/previous -mindepth 1 -maxdepth 1 -type d | sort | tail -n1)

if [ -z "$latest_prev" ]; then
  info "No previous deployment found."
  exit 1
fi

read -r -p "Are you sure you want to roll back to the latest previous deployment '$latest_prev'? (yes/no) " confirm
if [[ "$confirm" != "yes" ]]; then
  info "Rollback cancelled."
  exit 0
fi

info "Rolling back to $latest_prev"

rsync -a --delete "$latest_prev"/ deployments/current/
rm -rf "$latest_prev"

info "Rollback complete"
