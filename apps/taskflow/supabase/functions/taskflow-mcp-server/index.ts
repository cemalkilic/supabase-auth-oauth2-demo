// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Main server handler
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("MCP Server starting...")

// Define available tools
const tools = [
  {
    name: "get_tasks",
    description: "Fetch all tasks from TaskFlow API for the authenticated user",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
]

// Handle tool execution
async function executeTool(name: string, args: Record<string, unknown>, token: string) {
  if (name === "get_tasks") {
    try {
      console.log("get_tasks tool called")
      console.log(`Using access token: ${token.substring(0, 20)}...`)

      // Determine the TaskFlow API URL based on environment
      // In Supabase Edge Functions, use host.docker.internal to reach the host machine
      const taskflowApiUrl = (globalThis as any).Deno?.env?.get("TASKFLOW_API_URL") || "http://host.docker.internal:3000"
      const apiUrl = `${taskflowApiUrl}/api/tasks`
      
      console.log(`Making request to ${apiUrl}`)

      // Make authenticated request to TaskFlow API
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log(`Response status: ${response.status}`)

      if (response.status === 401) {
        console.error("Authentication failed")
        return {
          content: [
            {
              type: "text",
              text: "Error: Authentication failed. Your token may be invalid or expired.",
            },
          ],
        }
      }

      if (response.status !== 200) {
        console.error(`Failed to fetch tasks: ${response.status}`)
        return {
          content: [
            {
              type: "text",
              text: `Error: Failed to fetch tasks (Status: ${response.status})`,
            },
          ],
        }
      }

      const data = await response.json()

      if (!data.success) {
        console.error("API returned unsuccessful response")
        return {
          content: [
            {
              type: "text",
              text: "Error: API returned unsuccessful response",
            },
          ],
        }
      }

      const tasks = data.data || []
      const user = data.user || {}

      console.log(`Fetched ${tasks.length} tasks for user ${user.email}`)

      if (tasks.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No tasks found for user ${user.email || "unknown"}`,
            },
          ],
        }
      }

      // Format tasks as a readable string
      let result = `Tasks for ${user.email || "unknown"} (Total: ${tasks.length}):\n\n`

      tasks.forEach((task: any, idx: number) => {
        const status = task.completed ? "✓" : "○"
        const title = task.title || "Untitled"
        const taskId = task.id || ""
        const createdAt = task.created_at || ""

        result += `${idx + 1}. [${status}] ${title}\n`
        result += `   ID: ${taskId}\n`
        result += `   Created: ${createdAt}\n\n`
      })

      return {
        content: [
          {
            type: "text",
            text: result.trim(),
          },
        ],
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`Error in get_tasks: ${errorMessage}`)
      return {
        content: [
          {
            type: "text",
            text: `Error: ${errorMessage}`,
          },
        ],
      }
    }
  }

  throw new Error(`Unknown tool: ${name}`)
}

// Serve HTTP requests
;(globalThis as any).Deno?.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);

  // Check if this is an OAuth protected resource request
  // Should end with .well-known/oauth-protected-resource
  const isOAuthProtectedResource = pathSegments.length >= 2 &&
    pathSegments[pathSegments.length - 2] === ".well-known" &&
    pathSegments[pathSegments.length - 1] === "oauth-protected-resource";
  if (isOAuthProtectedResource) {
    // For OAuth protected resource requests like:
    // /functions/v1/taskflow-mcp-server/.well-known/oauth-protected-resource

    // Return OAuth protected resource metadata
    const mcpUrl = `http://127.0.0.1:54321/functions/v1/taskflow-mcp-server`;
    const authServerUrl = `http://127.0.0.1:54321/auth/v1`;
    const metadata = {
      resource: mcpUrl,
      authorization_servers: [
        authServerUrl
      ],
      scopes_supported: ["profile"],
      bearer_methods_supported: ["header"],
      resource_documentation: `${url.origin}/docs/`,
    };

    return new Response(JSON.stringify(metadata, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Only allow POST for MCP operations
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    })
  }

  const path = url.pathname;
  const resourceMetadataUrl = `http://host.docker.internal:54321/.well-known/oauth-protected-resource/functions/v1${path}`;
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return new Response('Missing "Authorization" header', {
      status: 401,
      headers: {
        ...corsHeaders,
        "WWW-Authenticate": `Bearer error="invalid_request", error_description="Missing authorization header", resource_metadata="${resourceMetadataUrl}"`,
      },
    })
  }

  // TODO: Validate the JWT token here using Supabase Auth
  // For now, we'll accept any Bearer token
  if (!authHeader.startsWith("Bearer ")) {
    return new Response("Invalid authorization format", {
      status: 401,
      headers: {
        ...corsHeaders,
        "WWW-Authenticate": `Bearer error="invalid_token", error_description="Authorization must use Bearer scheme", resource_metadata="${resourceMetadataUrl}"`,
      },
    })
  }

  const token = authHeader.replace("Bearer ", "");
  console.log('token', token);

  try {
    const message = await req.json()
    const { jsonrpc, id, method, params } = message

    // Validate JSON-RPC structure
    if (jsonrpc !== "2.0") {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id,
          error: { code: -32600, message: "Invalid Request: jsonrpc must be 2.0" },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      )
    }

    // Handle notifications (no response needed)
    if (method === "notifications/initialized") {
      // MCP client notification that it has been initialized
      // Notifications don't require a response in JSON-RPC
      return new Response(null, { status: 200 })
    }

    // Route to appropriate handler for requests
    let result
    switch (method) {
      case "initialize":
        result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: "taskflow-mcp-server",
            version: "1.0.0",
          },
        }
        break

      case "tools/list":
        result = { tools }
        break

      case "tools/call":
        result = await executeTool(params.name, params.arguments || {}, token)
        break

      default:
        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Method not found: ${method}` },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        )
    }

    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id,
        result,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Error handling request:", error)
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: errorMessage },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})

/* To test locally:

  1. Run `supabase start`
  2. Start the TaskFlow API server (npm run dev in apps/taskflow)
  3. Test the MCP server:

  # List available tools
  curl -i --location --request POST 'http://localhost:54321/functions/v1/taskflow-mcp-server' \
    --header 'Authorization: Bearer <your-supabase-jwt-token>' \
    --header 'Content-Type: application/json' \
    --data '{
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tools/list",
      "params": {}
    }'

  # Call the get_tasks tool
  curl -i --location --request POST 'http://localhost:54321/functions/v1/taskflow-mcp-server' \
    --header 'Authorization: Bearer <your-supabase-jwt-token>' \
    --header 'Content-Type: application/json' \
    --data '{
      "jsonrpc": "2.0",
      "id": 2,
      "method": "tools/call",
      "params": {
        "name": "get_tasks",
        "arguments": {}
      }
    }'

*/
