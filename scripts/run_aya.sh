#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FORMAL_DIR="$REPO_ROOT/formal"

mapfile -d '' -t aya_files < <(find "$FORMAL_DIR" -name '*.aya' -print0)

relative_formal_path=${FORMAL_DIR#"$REPO_ROOT/"}
if [[ "$relative_formal_path" == "$FORMAL_DIR" ]]; then
  relative_formal_path=$(basename "$FORMAL_DIR")
fi

if ((${#aya_files[@]} == 0)); then
  echo "No Aya source files found under ${relative_formal_path}. Skipping Aya checks."
  exit 0
fi

echo "Running Aya engine on ${#aya_files[@]} Aya source file(s) under ${relative_formal_path}."
python3 -m tools.aya compile "${aya_files[@]}"
