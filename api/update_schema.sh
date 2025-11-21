#!/bin/bash
set -e

sqlite3 db/db.sqlite3 .schema > db/schema.sql
