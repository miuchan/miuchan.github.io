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
AYA_BASE_URL="${AYA_BASE_URL:-https://github.com/aya-prover/aya-dev/releases/download}"
AYA_BASE_URL="${AYA_BASE_URL%/}"
AYA_URL="$AYA_BASE_URL/v$AYA_VERSION/aya-cli-$AYA_VERSION-all.jar"

CURL_OPTS=(-fL --retry 3 --retry-delay 2 --retry-all-errors)
CURL_OPTS+=(-H "User-Agent: aya-install-script")

if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  CURL_OPTS+=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
  CURL_OPTS+=(-H "Accept: application/octet-stream")
fi

mkdir -p "$AYA_DIR"

if [[ ! -f "$AYA_JAR" ]]; then
  echo "Downloading Aya CLI $AYA_VERSION from $AYA_URL..."
  if ! curl "${CURL_OPTS[@]}" "$AYA_URL" -o "$AYA_JAR"; then
    echo "Failed to download Aya CLI from $AYA_URL" >&2
    echo "You can set AYA_BASE_URL to a mirror before running this script." >&2
    exit 1
  fi
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
- 若网络访问受限，可设置 `AYA_BASE_URL` 指向对应的镜像源。
- 生成的二进制会放在 `tools/aya/`，默认被 `.gitignore` 排除。
DOC

echo "Aya CLI installation complete. Use tools/aya/aya to run commands."
