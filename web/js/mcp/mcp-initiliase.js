import { getMcpConfig } from "./mcp-config"

export function startMcpServers() {
    // const mcpPaths = getMcpConfig()

    // const mcpServerProcess = await startMCPServer('../basic-mcp/server.js')

}

async function startMCPServer(mcpPath) {
    const serverPath = path.join(__dirname, mcpPath);
    console.log('🔌 Starting MCP server at:', serverPath);

    return new Promise((resolve, reject) => {
        const mcpServerProcess = spawn('node', [serverPath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: __dirname
        });

        mcpServerProcess.on('error', (error) => {
            console.error('❌ Failed to start MCP server:', error.message);
            reject(error);
        });

        mcpServerProcess.stderr.on('data', (data) => {
            const message = data.toString().trim();
            console.log('🔍 MCP Server:', message);

            // Resolve when we see the server is running
            if (message.includes('MCP Server running')) {
                resolve(mcpServerProcess);
            }
        });

        // Timeout fallback
        setTimeout(() => {
            console.log('✅ MCP server should be running');
            resolve();
        }, 2000);
    });
}
