#!/bin/sh
set -e

# FastAPI backend — internal only, Next proxies /api/py/* to it (next.config.js).
python -m uvicorn api.index:app --host 127.0.0.1 --port 8000 &

# Next.js — the public-facing server on :3000. exec so it becomes PID 1 and
# receives SIGTERM directly for graceful shutdown.
exec npm run start
