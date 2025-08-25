# Clear signing erc7730 builder

This project has the goal to build an erc7730 json for clear signing

## Setup

### Prerequisites

- Node.js (for the Next.js frontend)
- Python 3.12+ (required for the `erc7730` package)
- Homebrew (on macOS) or your preferred Python installation method

### Python Environment Setup

The Python API requires Python 3.12+ and uses a virtual environment to manage dependencies.

1. **Install Python 3.12+ (if not already installed)**:
   ```bash
   # On macOS with Homebrew
   brew install python@3.12
   
   # On other systems, visit https://www.python.org/downloads/
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # Create virtual environment
   python3.12 -m venv .venv
   # or if python3.12 is in your PATH as python3
   python3 -m venv .venv
   
   # Activate virtual environment
   source .venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit the .env file and add your Etherscan API key
   # Get a free API key from https://etherscan.io/apis
   ```
   
   Then edit the `.env` file and replace `your_etherscan_api_key_here` with your actual Etherscan API key.

### Running the Application

```bash
npm install
npm run dev
```

This will start:
- Next.js frontend on `http://localhost:3000`
- Python FastAPI backend on `http://127.0.0.1:8000`


### API Documentation

Once the Python API is running, you can access the interactive API documentation at:
- `http://127.0.0.1:8000/api/py/docs`

# How It Works

## python api
The Python/FastAPI server is mapped into to Next.js app under `/api/`.

This is implemented using [`next.config.js` rewrites](https://github.com/digitros/nextjs-fastapi/blob/main/next.config.js) to map any request to `/api/py/:path*` to the FastAPI API, which is hosted in the `/api` folder.

Also, the app/api routes are available on the same domain, so you can use NextJs Route Handlers and make requests to `/api/...`.

On localhost, the rewrite will be made to the `127.0.0.1:8000` port, which is where the FastAPI server is running.

In production, the FastAPI server is hosted as [Python serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python) on Vercel.

## web project

The project is runing with this core technologies

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [shadcn](https://ui.shadcn.com/)
- [tanstack](https://tanstack.com/)
- [zustand](https://zustand-demo.pmnd.rs/)

# Copyright and license

This code is Copyright LEDGER SAS 2024 and published under the Apache-2.0 license.
