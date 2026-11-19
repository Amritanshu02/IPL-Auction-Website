FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

# Build bcrypt from source if a prebuilt binary is unavailable.
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ make python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm_config_nodedir=/usr/local \
    npm ci --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production \
    PORT=8000 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_NO_SANDBOX=true

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

RUN install -d -m 0700 -o node -g node /var/lib/ipl-auction/auth

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

USER node
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=5 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + process.env.PORT + '/healthz').then(res => { if (!res.ok) process.exitCode = 1; }).catch(() => { process.exitCode = 1; });"]
CMD ["node", "docker-start.js"]
