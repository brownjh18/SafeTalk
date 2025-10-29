#!/bin/bash
set -e

APP_PATH="/var/www/html"

# If .env does not exist, copy example
if [ ! -f "$APP_PATH/.env" ]; then
  cp "$APP_PATH/.env.example" "$APP_PATH/.env" || true
fi

cd "$APP_PATH"

# Generate application key if missing
if [ -z "$(php artisan tinker --execute 'echo config("app.key");' 2>/dev/null)" ]; then
  php artisan key:generate --force || true
fi

# Run migrations and seed only when explicitly enabled
if [ "${RUN_MIGRATIONS}" = "true" ]; then
  php artisan migrate --force || true
  php artisan db:seed --force || true
fi

# Ensure permissions
chown -R www-data:www-data storage bootstrap/cache || true

exec "$@"
