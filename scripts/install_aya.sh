#!/usr/bin/env bash
set -euo pipefail

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to download Aya CLI." >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AYA_DIR="$REPO_ROOT/tools/aya"
AYA_VERSION="${AYA_VERSION:-0.31.0}"
AYA_JAR="$AYA_DIR/aya-cli-$AYA_VERSION-all.jar"
AYA_URL="https://github.com/aya-prover/aya-dev/releases/download/v$AYA_VERSION/aya-cli-$AYA_VERSION-all.jar"

mkdir -p "$AYA_DIR"

if [[ ! -f "$AYA_JAR" ]]; then
  echo "Downloading Aya CLI $AYA_VERSION..."
  curl -L "$AYA_URL" -o "$AYA_JAR"
else
  echo "Aya CLI $AYA_VERSION already present at $AYA_JAR"
fi

cat > "$AYA_DIR/aya" <<'WRAPPER'
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AYA_VERSION="${AYA_VERSION:-0.31.0}"
JAR_PATH="${SCRIPT_DIR}/aya-cli-${AYA_VERSION}-all.jar"
exec java -jar "$JAR_PATH" "$@"
WRAPPER
chmod +x "$AYA_DIR/aya"

cat > "$AYA_DIR/README.md" <<'DOC'
# Aya CLI Wrapper

运行 `scripts/install_aya.sh` 会下载对应版本的 Aya CLI JAR 文件，并生成
一个可执行的 `tools/aya/aya` 脚本，以方便在 CI 与本地调用。

- 若需指定版本，可设置环境变量 `AYA_VERSION`。
- 生成的二进制会放在 `tools/aya/`，默认被 `.gitignore` 排除。
DOC

echo "Aya CLI installation complete. Use tools/aya/aya to run commands."
