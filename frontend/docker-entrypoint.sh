#!/bin/sh
echo "Generating environment configuration..."
envsubst < /tmp/env-config.js.template > /usr/share/nginx/html/env-config.js
echo "Starting Nginx..."
nginx -g "daemon off;"