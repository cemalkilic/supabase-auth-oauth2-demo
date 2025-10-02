# TaskFlow MCP Server (Python)

A Python application for the OAuth 2.1 demo project.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup

1. **Create a virtual environment** (recommended):
```bash
python3 -m venv venv
```

2. **Activate the virtual environment**:

On macOS/Linux:
```bash
source venv/bin/activate
```

On Windows:
```bash
venv\Scripts\activate
```

3. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and replace `<ref>` with your Supabase project reference.
If you're using the local supabase instance from this repo, you don't need any changes.
Make sure Taskflow is also running and `TASKFLOW_API_URL` is configured correctly.

4. **Install dependencies**:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python main.py
```

Or make it executable and run directly:
```bash
chmod +x main.py
./main.py
```

## Development

This Python app is **not managed by Turborepo**. Unlike the JavaScript/TypeScript apps in this monorepo, you'll need to run this application separately:

- The main monorepo scripts (`npm run dev`, `npm run build`) will **not** include this Python app
- You must manage this app independently using Python tools
- Use `python main.py` or your preferred Python development workflow

## Environment Variables

The `.env.example` file contains the required environment variables. Copy it to `.env` and fill in your values:

```bash
cp .env.example .env
```

## Project Structure

```
taskflow-mcp-server/
├── main.py              # Main application entry point
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── .env                # Your local environment config (git-ignored)
├── README.md           # This file
└── venv/               # Virtual environment (git-ignored)
```

## Notes

- This app runs independently from the Node.js/Turborepo setup
- You'll need to manually start/stop this application
- Consider using tools like `nodemon` equivalent for Python (e.g., `watchdog`, `entr`) for auto-reload during development
