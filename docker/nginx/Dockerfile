# ---------------------------------------------------------------------------
# Builder stage — Node LTS (Alpine) + php-cli
# ---------------------------------------------------------------------------
# node:lts-alpine gives us the latest Node LTS release (currently v24 LTS)
# with npm bundled.
#
# php-cli is required because the @laravel/vite-plugin-wayfinder plugin calls
# `php artisan wayfinder:generate --with-form` during `npm run build`.
# Artisan needs a minimal .env to bootstrap Laravel (APP_KEY + a dummy DB
# driver so it never tries to open a real DB connection).
# ---------------------------------------------------------------------------
FROM node:lts-alpine AS builder

# APP_KEY must be passed at build time:
#   docker build --build-arg APP_KEY="base64:..." .
# In compose.prod.yaml, add `args: [APP_KEY]` under the web.build section
# (Docker Compose will read APP_KEY from your .env file automatically).
ARG APP_KEY

RUN apk add --no-cache php83 php83-cli php83-common \
        php83-tokenizer php83-xml php83-xmlwriter php83-phar \
        php83-mbstring php83-openssl php83-curl php83-fileinfo \
        php83-dom php83-json php83-pcntl php83-posix \
    && ln -sf /usr/bin/php83 /usr/local/bin/php

WORKDIR /var/www

# Copy the full application so artisan + vendor are available
COPY . /var/www

# Create a minimal .env so that `php artisan` can bootstrap Laravel.
# - APP_KEY: provided via build arg (required by Illuminate encryption).
# - DB_CONNECTION=sqlite with in-memory DB: prevents any real DB connection.
RUN printf 'APP_NAME=organiso\nAPP_ENV=production\nAPP_KEY=%s\nAPP_DEBUG=false\nDB_CONNECTION=sqlite\nDB_DATABASE=:memory:\n' "$APP_KEY" > /var/www/.env

RUN npm ci && npm run build

# ---------------------------------------------------------------------------
# Final stage — Nginx (Alpine)
# ---------------------------------------------------------------------------
FROM nginx:alpine

COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /var/www/public /var/www/public

WORKDIR /var/www/public

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
