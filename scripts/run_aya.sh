#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AYA_BIN="$REPO_ROOT/tools/aya/aya"
FORMAL_DIR="$REPO_ROOT/formal"

if [[ ! -x "$AYA_BIN" ]]; then
  echo "Aya binary not found. Please run scripts/install_aya.sh first." >&2
  exit 1
fi

find "$FORMAL_DIR" -name '*.aya' -print0 | while IFS= read -r -d '' file; do
  echo "Checking ${file#"$REPO_ROOT/"}"
  "$AYA_BIN" compile "$file"
done
