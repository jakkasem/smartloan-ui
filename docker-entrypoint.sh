#!/bin/sh
sed -i "s|__API_BASE_URL__|${API_BASE_URL}|g" /usr/share/nginx/html/env.js
sed -i "s|__API_KEY__|${API_KEY}|g" /usr/share/nginx/html/env.js
nginx -g 'daemon off;'
