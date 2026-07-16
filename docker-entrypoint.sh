#!/bin/sh
# Inject VITE_* environment variables as window.__ENV__ at container startup.
# This allows runtime env configuration without rebuilding the image.
CONFIG_FILE="/usr/share/nginx/html/env-config.js"

printf 'window.__ENV__ = {\n' > "$CONFIG_FILE"

env | grep '^VITE_' | while read -r line; do
  key="${line%%=*}"
  value="${line#*=}"
  escaped=$(printf '%s' "$value" | sed 's/\\/\\\\/g; s/"/\\"/g')
  printf '  "%s": "%s",\n' "$key" "$escaped" >> "$CONFIG_FILE"
done

printf '};\n' >> "$CONFIG_FILE"

exec "$@"
