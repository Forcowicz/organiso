# ---------------------------------------------------------------------------
# php-app builder — installs Composer dependencies (vendor/) and pre-generates
# Wayfinder TypeScript types via `php artisan wayfinder:generate`.
# We reuse the same base image as the php-fpm Dockerfile so that PHP + all
# extensions are already present and artisan can fully bootstrap Laravel.
# ---------------------------------------------------------------------------
FROM php:8.5-fpm AS php-app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl unzip libpq-dev libonig-dev libssl-dev libxml2-dev \
    libcurl4-openssl-dev libicu-dev libzip-dev \
    && docker-php-ext-install -j$(nproc) pdo_pgsql pgsql intl zip bcmath soap \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /var/www

COPY . /var/www

# Install Composer dependencies (no dev, optimised autoloader)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader --no-interaction --no-progress --prefer-dist

# Create a minimal .env so artisan can bootstrap (APP_KEY + dummy sqlite DB).
# APP_KEY is passed as a build arg from compose.prod.yaml / docker build --build-arg.
ARG APP_KEY
RUN printf 'APP_NAME=organiso\nAPP_ENV=production\nAPP_KEY=%s\nAPP_DEBUG=false\nDB_CONNECTION=sqlite\nDB_DATABASE=/tmp/build.sqlite\n' "$APP_KEY" > /var/www/.env

# Pre-generate Wayfinder TypeScript types.
# This runs before the Vite build so the generated files exist in
# resources/js/actions, resources/js/routes, resources/js/wayfinder.
RUN php artisan wayfinder:generate --with-form

# ---------------------------------------------------------------------------
# Node builder — builds the frontend assets with Vite.
# WAYFINDER_COMMAND=true tells the wayfinder Vite plugin to skip re-running
# `php artisan wayfinder:generate` (files are already generated above).
# ---------------------------------------------------------------------------
FROM node:lts-alpine AS node-builder

WORKDIR /var/www

# Copy the full application including the pre-generated wayfinder files
COPY --from=php-app /var/www /var/www

ENV WAYFINDER_COMMAND=true

RUN npm ci && npm run build

# ---------------------------------------------------------------------------
# Final stage — Nginx (Alpine)
# ---------------------------------------------------------------------------
FROM nginx:alpine

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=node-builder /var/www/public /var/www/public

WORKDIR /var/www/public

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
