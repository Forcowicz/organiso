#!/bin/sh
set -e

# ---------------------------------------------------------------------------
# Sync built Vite assets from the baked image to the shared Docker volume.
#
# Why: The 'organiso-public-build' volume is shared between nginx and php-fpm.
# php-fpm needs public/build/.vite/manifest.json to generate hashed asset URLs
# via the @vite() blade directive. The actual asset files are served by nginx.
#
# The volume is mounted at /var/www/public/build in both containers.
# We keep a baked copy at /var/www/public-build-baked so the volume mount
# at /var/www/public/build does not shadow the image files on startup.
# ---------------------------------------------------------------------------
echo "==> [nginx entrypoint] Syncing build assets to shared volume..."
cp -rT /var/www/public-build-baked/ /var/www/public/build/
echo "==> [nginx entrypoint] Assets synced. Starting nginx..."

exec nginx -g "daemon off;"
