#!/usr/bin/env node

const { ChatOllama } = require('@langchain/ollama');
const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

class MCPLangChainApp {
  constructor() {
    this.mcpServerProcess = null;
    this.ollama = null;
    this.availableTools = [
      { name: 'echo', description: 'Echo back the provided text' },
      { name: 'add', description: 'Add two numbers together' }
    ];
  }

  async initialize() {
    console.log('🚀 Initializing MCP LangChain Application...');
    
    // Initialize Ollama
    this.ollama = new ChatOllama({
      baseUrl: 'http://localhost:11434',
      model: 'qwen3:8b', // Change this to your preferred model
      temperature: 0.7,
    });

    // Start MCP server process
    await this.startMCPServer();
    
    console.log('✅ Application initialized successfully!');
    console.log('📋 Available MCP tools:', this.availableTools.map(t => t.name).join(', '));
    console.log('💬 You can now chat! Type "exit" to quit.\n');
  }

  async startMCPServer() {
    const serverPath = path.join(__dirname, '../basic-mcp/server.js');
    console.log('🔌 Starting MCP server at:', serverPath);
    
    return new Promise((resolve, reject) => {
      this.mcpServerProcess = spawn('node', [serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: __dirname
      });

      this.mcpServerProcess.on('error', (error) => {
        console.error('❌ Failed to start MCP server:', error.message);
        reject(error);
      });

      this.mcpServerProcess.stderr.on('data', (data) => {
        const message = data.toString().trim();
        console.log('🔍 MCP Server:', message);
        
        // Resolve when we see the server is running
        if (message.includes('MCP Server running')) {
          resolve();
        }
      });

      // Timeout fallback
      setTimeout(() => {
        console.log('✅ MCP server should be running');
        resolve();
      }, 2000);
    });
  }

  async callMCPTool(toolName, args) {
    return new Promise((resolve) => {
      try {
        const request = {
          jsonrpc: '2.0',
          id: Math.random().toString(36).substring(7),
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args
          }
        };

        const requestStr = JSON.stringify(request) + '\n';
        
        // Set up response listener
        const responseHandler = (data) => {
          try {
            const lines = data.toString().split('\n').filter(line => line.trim());
            for (const line of lines) {
              const response = JSON.parse(line);
              if (response.id === request.id) {
                this.mcpServerProcess.stdout.removeListener('data', responseHandler);
                
                if (response.error) {
                  resolve(`Error: ${response.error.message}`);
                } else {
                  const content = response.result?.content?.[0]?.text || 'No response';
                  resolve(content);
                }
                return;
              }
            }
          } catch (e) {
            // Ignore JSON parse errors, wait for complete response
          }
        };

        this.mcpServerProcess.stdout.on('data', responseHandler);
        
        // Send request
        this.mcpServerProcess.stdin.write(requestStr);
        
        // Timeout fallback
        setTimeout(() => {
          this.mcpServerProcess.stdout.removeListener('data', responseHandler);
          resolve(`Timeout calling tool ${toolName}`);
        }, 5000);

      } catch (error) {
        resolve(`Error calling tool ${toolName}: ${error.message}`);
      }
    });
  }

  parseToolCalls(text) {
    // Simple parser to extract tool calls from LLM response
    const toolCallRegex = /TOOL_CALL:\s*(\w+)\s*\((.*?)\)/g;
    const calls = [];
    let match;

    while ((match = toolCallRegex.exec(text)) !== null) {
      const toolName = match[1];
      const argsStr = match[2];
      
      try {
        // Parse arguments (expecting JSON-like format)
        const args = JSON.parse(`{${argsStr}}`);
        calls.push({ name: toolName, args });
      } catch (e) {
        console.warn(`Failed to parse tool call arguments: ${argsStr}`);
      }
    }

    return calls;
  }

  async processUserInput(userInput) {
    // Create a prompt that includes information about available tools
    const toolsInfo = this.availableTools.map(tool => 
      `- ${tool.name}: ${tool.description}`
    ).join('\n');

    const systemPrompt = `You are an AI assistant that can use tools. Available tools: ${toolsInfo}

                        To use a tool, respond with: TOOL_CALL: toolName("arg1": "value1", "arg2": "value2")

                        Examples:
                        - To echo text: TOOL_CALL: echo("text": "Hello World")
                        - To add numbers: TOOL_CALL: add("a": 5, "b": 3)

                        You can use multiple tools in one response. Always explain what you're doing and interpret the results.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${userInput}`;

    try {
      // Get response from Ollama
      console.log('\n🤔 Thinking...');
      const response = await this.ollama.invoke(fullPrompt);
      const responseText = response.content || response;

      console.log('\n🤖 AI Response:');
      console.log(responseText);

      // Check for tool calls in the response
      const toolCalls = this.parseToolCalls(responseText);
      
      if (toolCalls.length > 0) {
        console.log('\n🔧 Executing tools...');
        
        for (const call of toolCalls) {
          console.log(`\n📞 Calling ${call.name} with:`, JSON.stringify(call.args));
          const toolResult = await this.callMCPTool(call.name, call.args);
          console.log(`📋 Result: ${toolResult}`);
        }
      }

    } catch (error) {
      console.error('❌ Error:', error.message);
      
      // Check if it's an Ollama connection error
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch')) {
        console.log('💡 Make sure Ollama is running: ollama serve');
        console.log('💡 And that you have a model pulled: ollama pull llama2');
      }
    }
  }

  async startInteractiveChat() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('💡 Try asking: "Can you echo hello world and add 2 plus 3?"');

    const askQuestion = () => {
      rl.question('\n👤 You: ', async (input) => {
        if (input.toLowerCase() === 'exit') {
          console.log('\n👋 Goodbye!');
          if (this.mcpServerProcess) {
            this.mcpServerProcess.kill();
          }
          rl.close();
          process.exit(0);
        }

        await this.processUserInput(input);
        askQuestion();
      });
    };

    askQuestion();
  }
}

// Main execution
async function main() {
  const app = new MCPLangChainApp();
  
  try {
    await app.initialize();
    await app.startInteractiveChat();
  } catch (error) {
    console.error('❌ Failed to start application:', error.message);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  process.exit(0);
});

main();