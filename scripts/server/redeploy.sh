#!/usr/bin/env bash
# Server-side redeploy hook for gerhard.page (called by the /server repo's
# deploy/deploy.sh). Change detection is already done by deploy.sh — this
# script only pulls, builds, and restarts. One-time host prerequisites:
# sudoers rule for systemctl restart of the two services (see
# /home/server/server/deploy/sudoers-autodeploy).
set -euo pipefail
REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

# pnpm may not be on the minimal PATH systemd gives us.
command -v pnpm >/dev/null 2>&1 || export PATH="$PATH:/usr/local/bin"

cd "$REPO_DIR"

echo "[gerhardPage] pulling..."
git pull --ff-only

echo "[gerhardPage] installing deps..."
pnpm install --frozen-lockfile

echo "[gerhardPage] building..."
pnpm run build

echo "[gerhardPage] syncing unit files (if changed)..."
units_changed=0
for unit in gerhardPage.service gerhardPageServer.service; do
  if ! cmp -s "scripts/server/$unit" "/etc/systemd/system/$unit"; then
    sudo cp "scripts/server/$unit" "/etc/systemd/system/$unit"
    units_changed=1
  fi
done
if [ "$units_changed" -eq 1 ]; then
  sudo systemctl daemon-reload
fi

echo "[gerhardPage] restarting services..."
sudo systemctl restart gerhardPage.service gerhardPageServer.service

echo "[gerhardPage] health check..."
for _ in $(seq 1 15); do
  code=$(curl -s -o /dev/null -w '%{http_code}' https://gerhard.page || true)
  if [ "$code" = "200" ]; then
    echo "[gerhardPage] healthy"
    exit 0
  fi
  sleep 2
done
echo "[gerhardPage] health check FAILED" >&2
exit 1
