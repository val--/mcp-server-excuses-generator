import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

export class MCPServer {
  private tools: Map<string, any> = new Map();

  constructor() {
    this.setupTools();
  }

  private setupTools() {
    // Tool 1: Get current time
    this.tools.set('get_time', {
      name: 'get_time',
      description: 'Get the current time in ISO format',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    });

    // Tool 2: Calculate simple math
    this.tools.set('calculate', {
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
    });

    // Tool 3: Echo message
    this.tools.set('echo', {
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
    });
  }

  async handleRequest(request: any): Promise<any> {
    try {
      // For HTTP-based MCP, we need to handle the request differently
      // This is a simplified implementation
      if (request.method === 'tools/list') {
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: Array.from(this.tools.values())
          }
        };
      } else if (request.method === 'tools/call') {
        const toolName = request.params.name;
        const tool = this.tools.get(toolName);
        
        if (!tool) {
          return {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32601,
              message: `Tool '${toolName}' not found`
            }
          };
        }

        let result: any;
        
        switch (toolName) {
          case 'get_time':
            result = {
              content: [
                {
                  type: 'text',
                  text: new Date().toISOString()
                }
              ]
            };
            break;

          case 'calculate':
            try {
              const expression = request.params.arguments?.expression;
              if (!expression) {
                throw new Error('Expression is required');
              }
              const calcResult = eval(expression);
              result = {
                content: [
                  {
                    type: 'text',
                    text: `Result: ${calcResult}`
                  }
                ]
              };
            } catch (error) {
              return {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                  code: -32602,
                  message: `Invalid expression: ${error}`
                }
              };
            }
            break;

          case 'echo':
            const message = request.params.arguments?.message;
            if (!message) {
              return {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                  code: -32602,
                  message: 'Message is required'
                }
              };
            }
            result = {
              content: [
                {
                  type: 'text',
                  text: `Echo: ${message}`
                }
              ]
            };
            break;

          default:
            return {
              jsonrpc: '2.0',
              id: request.id,
              error: {
                code: -32601,
                message: `Tool '${toolName}' not implemented`
              }
            };
        }

        return {
          jsonrpc: '2.0',
          id: request.id,
          result
        };
      }

      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: 'Method not found'
        }
      };
    } catch (error) {
      console.error('MCP Server error:', error);
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32603,
          message: 'Internal error'
        }
      };
    }
  }
} 