# Base image with both Node and Python, pulled via the Ledger JFrog OSS proxy
# to avoid Docker Hub anonymous-pull rate limits on shared CI runners.
FROM jfrog.ledgerlabs.net/ossproxy-oci-proxy-dockerio/nikolaik/python-nodejs:python3.12-nodejs20-slim

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1 \
    # Next proxies /api/py/* to the local FastAPI (see next.config.js).
    PYTHON_API_URL=http://127.0.0.1:8000 \
    # Vendored Python deps installed in CI (pip install --target pydeps).
    PYTHONPATH=/app/pydeps \
    XDG_CACHE_HOME=/tmp

# --- Node app (built in CI: npm ci && npm run build) ---
COPY node_modules ./node_modules
COPY .next ./.next
COPY public ./public
COPY src ./src
COPY package.json next.config.js ./

# --- Python API + its vendored deps (installed in CI) ---
COPY api ./api
COPY pydeps ./pydeps

# Starts uvicorn (127.0.0.1:8000) + `next start` (0.0.0.0:3000).
COPY docker-entrypoint.sh ./docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]
