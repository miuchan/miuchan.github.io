#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FORMAL_DIR="$REPO_ROOT/formal"

find "$FORMAL_DIR" -name '*.aya' -print0 | while IFS= read -r -d '' file; do
  echo "Checking ${file#"$REPO_ROOT/"}"
  python3 -m tools.aya compile "$file"
done
