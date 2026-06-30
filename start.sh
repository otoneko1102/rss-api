#!/bin/bash
set -e

cd "$(dirname "$0")"

npm ci

npm run build

pm2 startOrRestart ecosystem.config.cjs
pm2 save
