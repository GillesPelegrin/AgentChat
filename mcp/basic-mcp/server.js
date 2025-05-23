#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getTools } from './src/tools-handler/tools-hander.js';


export class BasicMCPServer {
    constructor() {
        this.server = new Server(
            {
                name: 'basic-mcp-server',
                version: '0.1.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupToolHandlers();
    }

    setupToolHandlers() {
        const tools = getTools();

        // Handle tool listing
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return { tools: tools.map(tool => tool.getToolDescription()) };
        });

        // Handle tool execution
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            return tools.map(tool => tool.getToolHandlerContent())
                .filter(handler => handler.name == name)[0]
                .content(args)
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Basic MCP Server running on stdio');
    }
}

// Create and run the server
const server = new BasicMCPServer();
server.run().catch(console.error);