#!/usr/bin/env bash
# zlce-snapshot.sh: Mengambil cuplikan status git untuk pemulihan sesi terputus (Recovery Kasus A-D)

set -euo pipefail

INCLUDE_DIFF=false
if [[ "${1:-}" == "--diff" ]]; then
  INCLUDE_DIFF=true
fi

echo "=== ZLCE RECOVERY SNAPSHOT ==="
echo "waktu: $(date --iso-8601=seconds 2>/dev/null || date -Iseconds 2>/dev/null || date '+%Y-%m-%dT%H:%M:%S%z')"
echo "--- branch ---"
git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "not-a-git-repo"

echo "--- git status --short ---"
git status --short 2>/dev/null || true

echo "--- git log -5 ---"
git log -5 --format="%h %ci %s" 2>/dev/null || true

echo "--- git diff --stat (unstaged) ---"
git diff --stat 2>/dev/null || true

echo "--- git diff --stat (staged) ---"
git diff --cached --stat 2>/dev/null || true

if [ "$INCLUDE_DIFF" = true ]; then
  echo "--- git diff berkas terlacak (maks. 400 baris) ---"
  git diff 2>/dev/null | head -n 400 || true
fi

echo "--- zlce-check ---"
if command -v python3 >/dev/null 2>&1 && [ -f "scripts/zlce/zlce-check.py" ]; then
  python3 scripts/zlce/zlce-check.py 2>/dev/null || echo "zlce-check failed"
elif command -v python3 >/dev/null 2>&1 && [ -f "scripts/zlce-check.py" ]; then
  python3 scripts/zlce-check.py 2>/dev/null || echo "zlce-check failed"
else
  echo "[INFO] zlce-check skipped"
fi

echo "=== END SNAPSHOT ==="
