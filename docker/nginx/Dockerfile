# ---------------------------------------------------------------------------
# Builder stage — Node LTS (Alpine) + php-cli
# ---------------------------------------------------------------------------
# node:lts-alpine gives us the latest Node LTS release (currently v24) with
# npm bundled. php-cli is required because the @laravel/vite-plugin-wayfinder
# plugin calls `php artisan wayfinder:generate --with-form` during `npm run build`.
# ---------------------------------------------------------------------------
FROM node:lts-alpine AS builder

RUN apk add --no-cache php83 php83-cli php83-common \
        php83-tokenizer php83-xml php83-xmlwriter php83-phar \
        php83-mbstring php83-openssl php83-curl php83-fileinfo \
    && ln -sf /usr/bin/php83 /usr/local/bin/php

WORKDIR /var/www

# Copy the full application so artisan + vendor are available
COPY . /var/www

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
