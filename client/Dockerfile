FROM node:20-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ make python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm_config_nodedir=/usr/local npm ci --no-audit --no-fund

COPY public/ ./public/
COPY src/ ./src/

ARG REACT_APP_API_BASE_URL=/api/
ARG REACT_APP_SOCKET_URL=/

# Run the CRA build directly because the package script uses Windows cmd syntax.
RUN INLINE_RUNTIME_CHUNK=false PUBLIC_URL=/ \
    node node_modules/react-scripts/bin/react-scripts.js --openssl-legacy-provider build

FROM nginx:1.28-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html/

EXPOSE 80
