#!/bin/sh
set -e

echo "==> [entrypoint] Starting php-fpm container initialisation..."

# ---------------------------------------------------------------------------
# 1. Initialise the storage directory
# ---------------------------------------------------------------------------
# The 'organiso-storage-production' volume is mounted at /var/www/storage.
# On the first run the volume is empty, so we seed it from the
# /var/www/storage-init snapshot that was baked into the image during build.
# ---------------------------------------------------------------------------
echo "==> [entrypoint] Checking storage directory..."
if [ -z "$(ls -A /var/www/storage 2>/dev/null)" ]; then
    echo "==> [entrypoint] Storage is empty - copying defaults from storage-init..."
    cp -r /var/www/storage-init/. /var/www/storage/
    echo "==> [entrypoint] Storage seeded."
else
    echo "==> [entrypoint] Storage already initialised, skipping seed."
fi

# ---------------------------------------------------------------------------
# 2. Create a public/storage symlink inside the mounted volume
# ---------------------------------------------------------------------------
# 'php artisan storage:link' creates /var/www/public/storage -> /var/www/storage/app/public
# We run it unconditionally (--force) so it is always correct.
# ---------------------------------------------------------------------------
echo "==> [entrypoint] Running: php artisan storage:link..."
php /var/www/artisan storage:link --force

# ---------------------------------------------------------------------------
# 3. Run database migrations
# ---------------------------------------------------------------------------
echo "==> [entrypoint] Running: php artisan migrate --force..."
php /var/www/artisan migrate --force

# ---------------------------------------------------------------------------
# 4. Cache configuration, routes and views for production performance
# ---------------------------------------------------------------------------
echo "==> [entrypoint] Caching config, routes and views..."
php /var/www/artisan config:cache
php /var/www/artisan route:cache
php /var/www/artisan view:cache

echo "==> [entrypoint] Initialisation complete. Starting php-fpm..."

# ---------------------------------------------------------------------------
# Hand off to the CMD specified in the Dockerfile (php-fpm).
# Using 'exec' replaces the shell process so php-fpm receives signals
# (SIGTERM etc.) directly from Docker.
# ---------------------------------------------------------------------------
exec "$@"
