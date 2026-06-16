#!/bin/bash
set -e
cd /home/hector1617/olimpo/acremining
git pull origin main
npm install
npm run build
docker compose up -d --build
