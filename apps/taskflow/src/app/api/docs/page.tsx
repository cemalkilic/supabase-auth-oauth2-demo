'use client'

import { useState } from 'react'

export default function ApiDocsPage() {
  const [testToken, setTestToken] = useState('demo_access_token_user123')
  const [testResponse, setTestResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testApiCall = async (endpoint: string, method: string = 'GET', body?: any) => {
    setIsLoading(true)
    setTestResponse('')

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`,
        },
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()

      setTestResponse(JSON.stringify({ status: response.status, ...data }, null, 2))
    } catch (error) {
      setTestResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskFlow API Documentation</h1>
        <p className="text-gray-600 mb-8">
          REST API for accessing TaskFlow data via OAuth 2.1 authentication.
        </p>

        {/* Authentication */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Authentication</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              All API requests require a valid OAuth 2.1 access token in the Authorization header:
            </p>
            <code className="block bg-gray-800 text-green-400 p-2 rounded text-sm">
              Authorization: Bearer &lt;access_token&gt;
            </code>
          </div>
          
          <div className="mb-4">
            <label htmlFor="testToken" className="block text-sm font-medium text-gray-700 mb-2">
              Test Token (for demo purposes):
            </label>
            <input
              id="testToken"
              type="text"
              value={testToken}
              onChange={(e) => setTestToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="demo_access_token_user123"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use format: demo_access_token_&lt;user_id&gt; for testing
            </p>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">API Endpoints</h2>

          {/* User Profile */}
          <div className="border border-gray-200 rounded-lg mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">User Profile</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">GET</span>
                <code className="text-gray-700">/api/user</code>
                <button
                  onClick={() => testApiCall('/api/user')}
                  disabled={isLoading}
                  className="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
              <p className="text-sm text-gray-600">Get current user profile information.</p>
              <div className="text-sm">
                <strong>Required Scopes:</strong> <code>profile:read</code>
              </div>
              <div className="text-sm">
                <strong>Optional Scopes:</strong> <code>tasks:read</code> (includes task statistics)
              </div>
            </div>
          </div>

          {/* Tasks Collection */}
          <div className="border border-gray-200 rounded-lg mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Tasks Collection</h3>
            </div>
            <div className="p-4 space-y-6">
              {/* GET /api/tasks */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">GET</span>
                  <code className="text-gray-700">/api/tasks</code>
                  <button
                    onClick={() => testApiCall('/api/tasks')}
                    disabled={isLoading}
                    className="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
                <p className="text-sm text-gray-600">Retrieve all tasks for the authenticated user.</p>
                <div className="text-sm">
                  <strong>Required Scopes:</strong> <code>tasks:read</code>
                </div>
              </div>

              {/* POST /api/tasks */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">POST</span>
                  <code className="text-gray-700">/api/tasks</code>
                  <button
                    onClick={() => testApiCall('/api/tasks', 'POST', { 
                      title: `Test Task ${Date.now()}`,
                      completed: false
                    })}
                    disabled={isLoading}
                    className="ml-auto bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Test
                  </button>
                </div>
                <p className="text-sm text-gray-600">Create a new task.</p>
                <div className="text-sm">
                  <strong>Required Scopes:</strong> <code>tasks:write</code>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <strong>Request Body:</strong>
                  <pre className="mt-2 text-xs">
{`{
  "title": "Task title (required)",
  "completed": false (optional)
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Task */}
          <div className="border border-gray-200 rounded-lg mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Individual Task</h3>
            </div>
            <div className="p-4 space-y-6">
              {/* GET /api/tasks/[id] */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">GET</span>
                  <code className="text-gray-700">/api/tasks/[id]</code>
                </div>
                <p className="text-sm text-gray-600">Retrieve a specific task by ID.</p>
                <div className="text-sm">
                  <strong>Required Scopes:</strong> <code>tasks:read</code>
                </div>
              </div>

              {/* PATCH /api/tasks/[id] */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">PATCH</span>
                  <code className="text-gray-700">/api/tasks/[id]</code>
                </div>
                <p className="text-sm text-gray-600">Update a specific task.</p>
                <div className="text-sm">
                  <strong>Required Scopes:</strong> <code>tasks:write</code>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <strong>Request Body:</strong>
                  <pre className="mt-2 text-xs">
{`{
  "title": "Updated title (optional)",
  "completed": true (optional)
}`}
                  </pre>
                </div>
              </div>

              {/* DELETE /api/tasks/[id] */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">DELETE</span>
                  <code className="text-gray-700">/api/tasks/[id]</code>
                </div>
                <p className="text-sm text-gray-600">Delete a specific task.</p>
                <div className="text-sm">
                  <strong>Required Scopes:</strong> <code>tasks:write</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scopes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">OAuth Scopes</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">profile:read</code>
              <span className="text-sm text-gray-600">Access basic profile information (email, ID, creation date)</span>
            </div>
            <div className="flex items-start gap-3">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">tasks:read</code>
              <span className="text-sm text-gray-600">View user&apos;s tasks and their completion status</span>
            </div>
            <div className="flex items-start gap-3">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">tasks:write</code>
              <span className="text-sm text-gray-600">Create, update, and delete tasks</span>
            </div>
          </div>
        </section>

        {/* Test Response */}
        {testResponse && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Response</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
              {testResponse}
            </pre>
          </section>
        )}

        {/* Error Responses */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Error Responses</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">401 Unauthorized</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700">
{`{
  "error": {
    "message": "Missing Authorization header",
    "code": 401,
    "timestamp": "2023-12-01T12:00:00.000Z"
  }
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">403 Forbidden</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700">
{`{
  "error": {
    "message": "Insufficient permissions. Required scope: tasks:read",
    "code": 403,
    "timestamp": "2023-12-01T12:00:00.000Z"
  }
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">404 Not Found</h4>
              <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700">
{`{
  "error": {
    "message": "Task not found",
    "code": 404,
    "timestamp": "2023-12-01T12:00:00.000Z"
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* CORS Information */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibont text-gray-800 mb-4">CORS Support</h2>
          <p className="text-gray-600 mb-4">
            The API supports Cross-Origin Resource Sharing (CORS) for the following origins:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 mb-4">
            <li><code>http://localhost:3001</code> (FocusTime development)</li>
            <li><code>http://localhost:3002</code> (Demo applications)</li>
            <li>Additional origins in production environments</li>
          </ul>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> In development mode, CORS is more permissive to enable testing.
              In production, only explicitly allowed origins can access the API.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}