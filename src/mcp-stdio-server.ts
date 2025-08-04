import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

class MCPStdioServer {
  private server: Server;
  private transport: StdioServerTransport;

  constructor() {
    this.server = new Server(
      {
        name: 'simple-mcp-server',
        version: '1.0.0',
      }
    );

    this.transport = new StdioServerTransport();
    this.setupTools();
    this.setupHandlers();
  }

  private setupTools() {
    // Tool 1: Get current time
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_time',
            description: 'Get the current time in ISO format',
            inputSchema: {
              type: 'object',
              properties: {},
              required: []
            }
          },
          {
            name: 'calculate',
            description: 'Perform simple mathematical calculations',
            inputSchema: {
              type: 'object',
              properties: {
                expression: {
                  type: 'string',
                  description: 'Mathematical expression to evaluate (e.g., "2 + 3 * 4")'
                }
              },
              required: ['expression']
            }
          },
          {
            name: 'echo',
            description: 'Echo back the provided message',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Message to echo back'
                }
              },
              required: ['message']
            }
          }
        ]
      };
    });

    // Handle call tool request
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'get_time':
          return {
            content: [
              {
                type: 'text',
                text: new Date().toISOString()
              }
            ]
          };

        case 'calculate':
          try {
            const expression = request.params.arguments?.expression as string;
            if (!expression) {
              throw new Error('Expression is required');
            }
            const result = eval(expression);
            return {
              content: [
                {
                  type: 'text',
                  text: `Result: ${result}`
                }
              ]
            };
          } catch (error) {
            throw new Error(`Invalid expression: ${error}`);
          }

        case 'echo':
          const message = request.params.arguments?.message as string;
          if (!message) {
            throw new Error('Message is required');
          }
          return {
            content: [
              {
                type: 'text',
                text: `Echo: ${message}`
              }
            ]
          };

        default:
          throw new Error(`Tool '${request.params.name}' not implemented`);
      }
    });
  }

  private setupHandlers() {
    // Les handlers sont déjà configurés dans setupTools
  }

  async run() {
    try {
      await this.server.connect(this.transport);
      console.error('MCP Server started via stdio');
    } catch (error) {
      console.error('Error starting MCP server:', error);
      process.exit(1);
    }
  }
}

// Démarrer le serveur
const server = new MCPStdioServer();
server.run(); 