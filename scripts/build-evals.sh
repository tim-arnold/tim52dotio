#!/usr/bin/env bash
# Builds the Eval/web Astro report viewer and copies it into out/evals,
# so it ships as part of the static export at tim52.io/evals/.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EVAL_WEB_DIR="$ROOT_DIR/Eval/web"
OUT_DIR="$ROOT_DIR/out"

if [ ! -d "$EVAL_WEB_DIR" ]; then
  echo "Eval/web not found, skipping evals build."
  exit 0
fi

if [ ! -d "$EVAL_WEB_DIR/node_modules" ]; then
  npm install --prefix "$EVAL_WEB_DIR"
fi

npm run build --prefix "$EVAL_WEB_DIR"

rm -rf "$OUT_DIR/evals"
mkdir -p "$OUT_DIR"
cp -r "$EVAL_WEB_DIR/dist" "$OUT_DIR/evals"
