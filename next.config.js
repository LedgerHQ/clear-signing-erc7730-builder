/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

// Base URL of the FastAPI service.
//  - container: PYTHON_API_URL=http://127.0.0.1:8000 (uvicorn runs alongside Next)
//  - local dev: defaults to 127.0.0.1:8000
//  - Vercel:    unset -> falls back to the "/api/" serverless path
const pyApiBase =
  process.env.PYTHON_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : null);

/** @type {import("next").NextConfig} */
const config = {
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination: pyApiBase ? `${pyApiBase}/api/py/:path*` : "/api/",
      },
      {
        source: "/docs",
        destination: pyApiBase ? `${pyApiBase}/api/py/docs` : "/api/py/docs",
      },
      {
        source: "/openapi.json",
        destination: pyApiBase
          ? `${pyApiBase}/api/py/openapi.json`
          : "/api/py/openapi.json",
      },
      {
        source: "/api/trpc/:path*",
        destination: "/api/trpc/:path*",
      },
    ];
  },
};

export default config;
