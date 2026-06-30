#!/bin/bash
set -e

cd "$(dirname "$0")"

npm ci

pm2 startOrRestart ecosystem.config.cjs
pm2 save
