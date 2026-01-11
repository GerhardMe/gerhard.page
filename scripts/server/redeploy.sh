#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/server/gerhardPage/gergus3"
BRANCH="main"
FRONTEND_SERVICE="gerhardPage.service"
BACKEND_SERVICE="gerhardPageServer.service"

cd "$APP_DIR"

echo "[redeploy] fetching..."
git fetch origin "$BRANCH"

LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
  echo "[redeploy] no changes; exiting."
  exit 0
fi

echo "[redeploy] updating to $REMOTE_COMMIT..."
git reset --hard "origin/$BRANCH"

echo "[redeploy] installing deps..."
pnpm install --frozen-lockfile

echo "[redeploy] building..."
pnpm run build

echo "[redeploy] restarting services..."
sudo systemctl restart "$FRONTEND_SERVICE"
sudo systemctl restart "$BACKEND_SERVICE"

echo "[redeploy] done."
