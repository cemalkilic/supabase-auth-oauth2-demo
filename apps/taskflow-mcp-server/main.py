import os
import sys
import logging
import uvicorn
import httpx
from dotenv import load_dotenv
from fastmcp import FastMCP, Context
from fastmcp.server.auth.providers.supabase import SupabaseProvider
from fastmcp.server.dependencies import get_access_token, AccessToken
from pydantic import AnyHttpUrl
from starlette.middleware.cors import CORSMiddleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get configuration from environment
TASKFLOW_SUPABASE_PROJECT_URL = os.getenv("TASKFLOW_SUPABASE_PROJECT_URL", "http://127.0.0.1:54321/")
TASKFLOW_API_URL = os.getenv("TASKFLOW_API_URL", "http://localhost:3000/api")

MCP_SERVER_PORT = 3005

auth = SupabaseProvider(
    project_url=TASKFLOW_SUPABASE_PROJECT_URL,
    base_url=f"http://localhost:{MCP_SERVER_PORT}",
    algorithm="ES256",
)

mcp = FastMCP(name="TaskFlow MCP Server", auth=auth)

@mcp.tool
async def get_tasks(ctx: Context) -> str:
    """
    Fetch all tasks from TaskFlow API.
    Returns a list of tasks for the authenticated user.
    """
    try:
        logger.info("get_tasks tool called")

        access_token: AccessToken = get_access_token()
        logger.info(f"Using access token: {access_token.token[:20]}..." if access_token else "No token")

        logger.info(f"Making request to {TASKFLOW_API_URL}/tasks")

        # Make authenticated request to TaskFlow API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{TASKFLOW_API_URL}/tasks",
                headers={
                    "Authorization": f"Bearer {access_token.token}",
                    "Content-Type": "application/json",
                },
                timeout=10.0,
            )

            logger.info(f"Response status: {response.status_code}")

            if response.status_code == 401:
                logger.error("Authentication failed")
                return "Error: Authentication failed. Your token may be invalid or expired."

            if response.status_code != 200:
                logger.error(f"Failed to fetch tasks: {response.status_code}")
                return f"Error: Failed to fetch tasks (Status: {response.status_code})"

            data = response.json()

            if not data.get("success"):
                logger.error("API returned unsuccessful response")
                return "Error: API returned unsuccessful response"

            tasks = data.get("data", [])
            user = data.get("user", {})

            logger.info(f"Fetched {len(tasks)} tasks for user {user.get('email')}")

            if not tasks:
                return f"No tasks found for user {user.get('email', 'unknown')}"

            # Format tasks as a readable string
            result = f"Tasks for {user.get('email', 'unknown')} (Total: {len(tasks)}):\n\n"

            for idx, task in enumerate(tasks, 1):
                status = "✓" if task.get("completed") else "○"
                title = task.get("title", "Untitled")
                task_id = task.get("id", "")
                created_at = task.get("created_at", "")

                result += f"{idx}. [{status}] {title}\n"
                result += f"   ID: {task_id}\n"
                result += f"   Created: {created_at}\n\n"

            return result.strip()

    except Exception as e:
        logger.exception(f"Error in get_tasks: {str(e)}")
        return f"Error: {str(e)}"

if __name__ == "__main__":
    logger.info("Starting TaskFlow MCP Server")
    logger.info(f"TASKFLOW_API_URL: {TASKFLOW_API_URL}")
    logger.info(f"TASKFLOW_SUPABASE_PROJECT_URL: {TASKFLOW_SUPABASE_PROJECT_URL}")

    # Setup Starlette app with CORS for cross-origin requests
    app = mcp.http_app()

    # add CORS middleware for browser based clients
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["mcp-session-id", "mcp-protocol-version"],
        max_age=86400,
    )

    # Get port from environment variable (Smithery sets this to 8081)
    port = int(os.environ.get("PORT", MCP_SERVER_PORT))
    logger.info(f"Listening on port {port}")

    # Run with log_level="info" to see uvicorn and FastMCP logs
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )
