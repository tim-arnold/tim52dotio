#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/_template"
CLIENTS_DIR="$SCRIPT_DIR/clients"

# ── helpers ────────────────────────────────────────────────────────────────────

prompt() {
  local label="$1"
  local default="${2:-}"
  local value

  if [[ -n "$default" ]]; then
    read -rp "  $label [$default]: " value
    echo "${value:-$default}"
  else
    read -rp "  $label: " value
    echo "$value"
  fi
}

prompt_yn() {
  local label="$1"
  local default="${2:-y}"
  local value
  read -rp "  $label [Y/n]: " value
  value="${value:-$default}"
  [[ "${value,,}" != "n" ]]
}

# ── main ───────────────────────────────────────────────────────────────────────

echo ""
echo "Add retest to existing client"
echo "─────────────────────────────"

# List existing clients
echo ""
echo "Existing clients:"
for d in "$CLIENTS_DIR"/*/; do
  [[ -d "$d" ]] && echo "  $(basename "$d")"
done
echo ""

read -rp "  Client slug: " SLUG
CLIENT_DIR="$CLIENTS_DIR/$SLUG"

if [[ ! -d "$CLIENT_DIR" ]]; then
  echo "Error: clients/$SLUG does not exist." >&2
  exit 1
fi

# ── discover audit types present for this client ────────────────────────────

AUDIT_LABELS=("SEO" "Technology" "WordPress" "Accessibility" "Analytics" "Performance" "Security")
AUDIT_DIRS=("seo-audit" "technology-audit" "wordpress-audit" "accessibility-audit" "analytics-audit" "performance-audit" "security-audit")

PRESENT_LABELS=()
PRESENT_DIRS=()

for i in "${!AUDIT_DIRS[@]}"; do
  dir="${AUDIT_DIRS[$i]}"
  label="${AUDIT_LABELS[$i]}"
  audit_dir="$CLIENT_DIR/$dir"
  if [[ -d "$audit_dir" ]]; then
    PRESENT_LABELS+=("$label")
    PRESENT_DIRS+=("$dir")
  fi
done

if [[ ${#PRESENT_DIRS[@]} -eq 0 ]]; then
  echo "Error: No audit directories found under clients/$SLUG/." >&2
  exit 1
fi

# ── for each present audit type, find the next retest number ────────────────

echo ""
echo "Audit types for $SLUG:"
echo ""

for i in "${!PRESENT_LABELS[@]}"; do
  dir="${PRESENT_DIRS[$i]}"
  label="${PRESENT_LABELS[$i]}"
  audit_dir="$CLIENT_DIR/$dir"

  # Find highest existing retest number
  max_n=0
  for d in "$audit_dir"/retest-*/; do
    [[ -d "$d" ]] || continue
    n="${d%/}"
    n="${n##*/retest-}"
    if [[ "$n" =~ ^[0-9]+$ ]] && (( n > max_n )); then
      max_n=$n
    fi
  done

  if (( max_n == 0 )); then
    echo "  · $label — no retests yet (will create retest-1)"
  else
    echo "  · $label — $(( max_n )) retest(s) exist (will create retest-$(( max_n + 1 )))"
  fi
done

# ── select which audit types to retest ──────────────────────────────────────

echo ""
echo "Which audit types to retest?"
echo ""

SELECTED_LABELS=()
SELECTED_DIRS=()

for i in "${!PRESENT_LABELS[@]}"; do
  label="${PRESENT_LABELS[$i]}"
  dir="${PRESENT_DIRS[$i]}"
  if prompt_yn "  $label" "y"; then
    SELECTED_LABELS+=("$label")
    SELECTED_DIRS+=("$dir")
  fi
done

if [[ ${#SELECTED_LABELS[@]} -eq 0 ]]; then
  echo ""
  echo "Nothing selected. Aborted."
  exit 0
fi

# ── confirm ─────────────────────────────────────────────────────────────────

echo ""
echo "Will create:"
for i in "${!SELECTED_LABELS[@]}"; do
  label="${SELECTED_LABELS[$i]}"
  dir="${SELECTED_DIRS[$i]}"
  audit_dir="$CLIENT_DIR/$dir"

  max_n=0
  for d in "$audit_dir"/retest-*/; do
    [[ -d "$d" ]] || continue
    n="${d%/}"; n="${n##*/retest-}"
    [[ "$n" =~ ^[0-9]+$ ]] && (( n > max_n )) && max_n=$n
  done
  next_n=$(( max_n + 1 ))

  echo "  clients/$SLUG/$dir/retest-$next_n/"
done

echo ""
read -rp "Proceed? [Y/n]: " confirm
if [[ "${confirm,,}" == "n" ]]; then
  echo "Aborted."
  exit 0
fi

# ── create retest directories ────────────────────────────────────────────────

TODAY=$(date +%Y-%m-%d)

for i in "${!SELECTED_LABELS[@]}"; do
  label="${SELECTED_LABELS[$i]}"
  dir="${SELECTED_DIRS[$i]}"
  audit_dir="$CLIENT_DIR/$dir"

  max_n=0
  for d in "$audit_dir"/retest-*/; do
    [[ -d "$d" ]] || continue
    n="${d%/}"; n="${n##*/retest-}"
    [[ "$n" =~ ^[0-9]+$ ]] && (( n > max_n )) && max_n=$n
  done
  next_n=$(( max_n + 1 ))

  retest_dir="$audit_dir/retest-$next_n"
  mkdir -p "$retest_dir/data" "$retest_dir/reports"

  # Drop .gitkeep placeholders
  touch "$retest_dir/data/.gitkeep"
  touch "$retest_dir/reports/.gitkeep"

  # Copy HANDOFF-retest.md from template if available
  tmpl_handoff="$TEMPLATE_DIR/$dir/HANDOFF-retest.md"
  if [[ -f "$tmpl_handoff" ]]; then
    cp "$tmpl_handoff" "$retest_dir/HANDOFF.md"
    # Inject retest number and date into the HANDOFF
    sed -i '' "s|{{RETEST_NUMBER}}|$next_n|g" "$retest_dir/HANDOFF.md"
    sed -i '' "s|{{RETEST_DATE}}|$TODAY|g" "$retest_dir/HANDOFF.md"
  fi

  # Update CLAUDE.md audit status: append retest info after the existing status line
  CLAUDE_FILE="$CLIENT_DIR/CLAUDE.md"
  if grep -q "^- ${label} audit:" "$CLAUDE_FILE" 2>/dev/null; then
    # Replace or append retest count note
    if grep -q "^- ${label} audit:.*retest" "$CLAUDE_FILE" 2>/dev/null; then
      # Already has a retest note — update the number
      sed -i '' "s|^- ${label} audit:.*|- ${label} audit: complete · retest-${next_n} in progress (started ${TODAY})|" "$CLAUDE_FILE"
    else
      sed -i '' "s|^- ${label} audit:.*|- ${label} audit: complete · retest-${next_n} in progress (started ${TODAY})|" "$CLAUDE_FILE"
    fi
  fi

  echo "  Created $dir/retest-$next_n/"
done

echo ""
echo "Done. Next steps:"
echo "  1. Open clients/$SLUG/ in Claude Code"
for i in "${!SELECTED_DIRS[@]}"; do
  dir="${SELECTED_DIRS[$i]}"
  audit_dir="$CLIENT_DIR/$dir"
  max_n=0
  for d in "$audit_dir"/retest-*/; do
    [[ -d "$d" ]] || continue
    n="${d%/}"; n="${n##*/retest-}"
    [[ "$n" =~ ^[0-9]+$ ]] && (( n > max_n )) && max_n=$n
  done
  if [[ -f "$audit_dir/retest-$max_n/HANDOFF.md" ]]; then
    echo "  2. Run the ${SELECTED_LABELS[$i]} retest: review clients/$SLUG/$dir/retest-$max_n/HANDOFF.md"
  fi
done
echo ""
