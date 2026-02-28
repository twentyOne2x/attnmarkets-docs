#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
NODE_SCRIPT="${REPO_ROOT}/scripts/copy_attn_in_context_to_clipboard.mjs"

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is required to generate the attn-in-context export." >&2
  exit 1
fi

if [[ ! -f "${NODE_SCRIPT}" ]]; then
  echo "Error: missing export generator: ${NODE_SCRIPT}" >&2
  exit 1
fi

node "${NODE_SCRIPT}"
