import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

class MCPHybridServer {
  private server: Server;
  private transport: StdioServerTransport;
  private expressApp: express.Application;
  private port: number;

  constructor() {
    this.server = new Server(
      {
        name: 'excuse-generator-mcp-server',
        version: '1.0.0',
      }
    );

    this.transport = new StdioServerTransport();
    this.expressApp = express();
    this.port = parseInt(process.env.PORT || '3000');
    
    this.setupExpress();
    this.setupTools();
    this.setupHandlers();
  }

  private setupExpress() {
    this.expressApp.use(cors());
    this.expressApp.use(express.json());

    // Health check endpoint
    this.expressApp.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // MCP HTTP endpoint
    this.expressApp.post('/mcp', async (req, res) => {
      try {
        const response = await this.handleHttpRequest(req.body);
        res.json(response);
      } catch (error) {
        console.error('MCP HTTP request error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Root endpoint
    this.expressApp.get('/', (req, res) => {
      res.json({
        name: 'Excuse Generator MCP Server',
        version: '1.0.0',
        mode: process.env.MCP_MODE || 'hybrid',
        endpoints: {
          health: '/health',
          mcp: '/mcp'
        }
      });
    });
  }

  private generateExcuse(type: string, context?: string): string {
    const excuses = {
      'retard': [
        "Désolé pour ce retard, j'ai été kidnappé par des ninjas qui voulaient mon code source.",
        "Je m'excuse, j'ai dû sauver un chaton coincé dans un arbre sur le chemin.",
        "Désolé, j'ai été téléporté dans une dimension parallèle pendant 2 heures.",
        "Je m'excuse, j'ai rencontré un mage qui a transformé ma voiture en citrouille.",
        "Désolé pour ce retard, j'ai été attaqué par un troupeau de moutons enragés.",
        "Je m'excuse, j'ai dû participer à un concours de danse avec des robots.",
        "Désolé, j'ai été kidnappé par des aliens qui voulaient apprendre JavaScript.",
        "Je m'excuse, j'ai dû sauver le monde d'une invasion de zombies.",
        "Désolé pour ce retard, j'ai été transformé en pingouin pendant 3 heures.",
        "Je m'excuse, j'ai dû négocier avec un dragon qui gardait le parking."
      ],
      'reunion_manquee': [
        "Désolé d'avoir manqué cette réunion, j'ai été kidnappé par des pirates informatiques.",
        "Je m'excuse, j'ai dû participer à un tournoi de rock-paper-scissors avec des IA.",
        "Désolé, j'ai été téléporté dans le passé et j'ai dû éviter de changer l'histoire.",
        "Je m'excuse, j'ai été transformé en chat et j'ai oublié comment utiliser Teams.",
        "Désolé pour cette réunion manquée, j'ai été kidnappé par des mimes silencieux.",
        "Je m'excuse, j'ai dû sauver un serveur d'une attaque de virus dansants.",
        "Désolé, j'ai été transformé en plante et j'ai mis 2 heures à retrouver ma forme.",
        "Je m'excuse, j'ai dû participer à un concours de programmation avec des hamsters.",
        "Désolé, j'ai été kidnappé par des clowns qui voulaient apprendre à coder.",
        "Je m'excuse, j'ai dû négocier avec un troll qui gardait ma connexion internet."
      ],
      'deadline': [
        "Désolé pour ce retard sur la deadline, j'ai été kidnappé par des bugs qui voulaient des vacances.",
        "Je m'excuse, j'ai dû apprendre à parler le langage des serveurs en détresse.",
        "Désolé, j'ai été transformé en code et j'ai mis du temps à me recompiler.",
        "Je m'excuse, j'ai dû sauver un projet d'une invasion de commentaires toxiques.",
        "Désolé pour ce retard, j'ai été kidnappé par des variables qui refusaient d'être déclarées.",
        "Je m'excuse, j'ai dû négocier avec un firewall qui avait des problèmes d'ego.",
        "Désolé, j'ai été transformé en regex et j'ai mis du temps à me débugger.",
        "Je m'excuse, j'ai dû sauver un commit d'une attaque de merge conflicts.",
        "Désolé pour ce retard, j'ai été kidnappé par des tests qui voulaient être plus stricts.",
        "Je m'excuse, j'ai dû apprendre à danser avec les logs d'erreur."
      ],
      'absence': [
        "Désolé pour cette absence, j'ai été transformé en licorne et j'ai dû apprendre à voler.",
        "Je m'excuse, j'ai été kidnappé par des pandas qui voulaient apprendre Python.",
        "Désolé, j'ai été téléporté dans un monde où les bugs n'existent pas.",
        "Je m'excuse, j'ai été transformé en pizza et j'ai mis du temps à me refroidir.",
        "Désolé pour cette absence, j'ai été kidnappé par des ninjas silencieux.",
        "Je m'excuse, j'ai dû participer à un concours de debugging avec des robots.",
        "Désolé, j'ai été transformé en emoji et j'ai oublié comment redevenir humain.",
        "Je m'excuse, j'ai été kidnappé par des mages qui voulaient optimiser mon code.",
        "Désolé pour cette absence, j'ai été transformé en café et j'ai été bu.",
        "Je m'excuse, j'ai dû sauver un projet d'une invasion de points-virgules manquants."
      ],
      'bug_critique': [
        "Désolé pour ce bug critique, j'ai été kidnappé par des gremlins du code.",
        "Je m'excuse, c'est la faute des elfes qui ont modifié mon code pendant la nuit.",
        "Désolé, j'ai été transformé en bug et j'ai mis du temps à me débugger.",
        "Je m'excuse, c'est un problème de configuration causé par des gnomes informatiques.",
        "Désolé pour ce bug critique, j'ai été kidnappé par des virus qui voulaient des vacances.",
        "Je m'excuse, c'est la faute d'un troll qui a changé mes variables en secret.",
        "Désolé, j'ai été transformé en exception et j'ai mis du temps à me catch.",
        "Je m'excuse, c'est un problème causé par des fantômes dans la machine.",
        "Désolé pour ce bug critique, j'ai été kidnappé par des hackers amateurs.",
        "Je m'excuse, c'est la faute d'un magicien qui a jeté un sort sur mon code."
      ],
      'pr_probleme': [
        "Désolé pour ce problème dans ma PR, j'ai été kidnappé par des reviewers trop stricts.",
        "Je m'excuse, j'ai été transformé en code legacy et j'ai mis du temps à me moderniser.",
        "Désolé, c'est la faute d'un troll qui a modifié mes tests pendant la nuit.",
        "Je m'excuse, j'ai été kidnappé par des linters qui voulaient être plus sévères.",
        "Désolé pour ce problème, j'ai été transformé en commentaire et j'ai été supprimé.",
        "Je m'excuse, c'est la faute d'un ninja qui a changé mes variables en secret.",
        "Désolé, j'ai été kidnappé par des bots qui voulaient apprendre à reviewer.",
        "Je m'excuse, j'ai été transformé en merge conflict et j'ai mis du temps à me résoudre.",
        "Désolé pour ce problème, c'est la faute d'un magicien qui a jeté un sort sur ma PR.",
        "Je m'excuse, j'ai été kidnappé par des gremlins qui ont modifié mon code."
      ]
    };

    const excuseList = excuses[type as keyof typeof excuses] || excuses.retard;
    const randomExcuse = excuseList[Math.floor(Math.random() * excuseList.length)];
    
    if (context) {
      return `${randomExcuse} ${context}`;
    }
    
    return randomExcuse;
  }

  private setupTools() {
    // Tool 1: Generate excuse for being late
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_retard_excuse',
            description: 'Generate a hilarious excuse for being late',
            inputSchema: {
              type: 'object',
              properties: {
                context: {
                  type: 'string',
                  description: 'Additional context for the excuse (optional)'
                }
              },
              required: []
            }
          },
          {
            name: 'generate_reunion_excuse',
            description: 'Generate a hilarious excuse for missing a meeting',
            inputSchema: {
              type: 'object',
              properties: {
                context: {
                  type: 'string',
                  description: 'Additional context for the excuse (optional)'
                }
              },
              required: []
            }
          },
          {
            name: 'generate_deadline_excuse',
            description: 'Generate a hilarious excuse for missing a deadline',
            inputSchema: {
              type: 'object',
              properties: {
                context: {
                  type: 'string',
                  description: 'Additional context for the excuse (optional)'
                }
              },
              required: []
            }
          },
          {
            name: 'generate_absence_excuse',
            description: 'Generate a hilarious excuse for being absent',
            inputSchema: {
              type: 'object',
              properties: {
                context: {
                  type: 'string',
                  description: 'Additional context for the excuse (optional)'
                }
              },
              required: []
            }
          },
          {
            name: 'generate_bug_excuse',
            description: 'Generate a hilarious excuse for a critical bug in production',
            inputSchema: {
              type: 'object',
              properties: {
                context: {
                  type: 'string',
                  description: 'Additional context for the excuse (optional)'
                }
              },
              required: []
            }
          },
          {
            name: 'generate_pr_excuse',
            description: 'Generate a hilarious excuse for a problematic PR',
            inputSchema: {
              type: 'object',
              properties: {
                context: {
                  type: 'string',
                  description: 'Additional context for the excuse (optional)'
                }
              },
              required: []
            }
          }
        ]
      };
    });

    // Handle call tool request
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const context = request.params.arguments?.context as string;
      
      switch (request.params.name) {
        case 'generate_retard_excuse':
          return {
            content: [
              {
                type: 'text',
                text: this.generateExcuse('retard', context)
              }
            ]
          };

        case 'generate_reunion_excuse':
          return {
            content: [
              {
                type: 'text',
                text: this.generateExcuse('reunion_manquee', context)
              }
            ]
          };

        case 'generate_deadline_excuse':
          return {
            content: [
              {
                type: 'text',
                text: this.generateExcuse('deadline', context)
              }
            ]
          };

        case 'generate_absence_excuse':
          return {
            content: [
              {
                type: 'text',
                text: this.generateExcuse('absence', context)
              }
            ]
          };

        case 'generate_bug_excuse':
          return {
            content: [
              {
                type: 'text',
                text: this.generateExcuse('bug_critique', context)
              }
            ]
          };

        case 'generate_pr_excuse':
          return {
            content: [
              {
                type: 'text',
                text: this.generateExcuse('pr_probleme', context)
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

  private async handleHttpRequest(request: any): Promise<any> {
    try {
      if (request.method === 'tools/list') {
        return {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: [
              {
                name: 'generate_retard_excuse',
                description: 'Generate a hilarious excuse for being late',
                inputSchema: {
                  type: 'object',
                  properties: {
                    context: {
                      type: 'string',
                      description: 'Additional context for the excuse (optional)'
                    }
                  },
                  required: []
                }
              },
              {
                name: 'generate_reunion_excuse',
                description: 'Generate a hilarious excuse for missing a meeting',
                inputSchema: {
                  type: 'object',
                  properties: {
                    context: {
                      type: 'string',
                      description: 'Additional context for the excuse (optional)'
                    }
                  },
                  required: []
                }
              },
              {
                name: 'generate_deadline_excuse',
                description: 'Generate a hilarious excuse for missing a deadline',
                inputSchema: {
                  type: 'object',
                  properties: {
                    context: {
                      type: 'string',
                      description: 'Additional context for the excuse (optional)'
                    }
                  },
                  required: []
                }
              },
              {
                name: 'generate_absence_excuse',
                description: 'Generate a hilarious excuse for being absent',
                inputSchema: {
                  type: 'object',
                  properties: {
                    context: {
                      type: 'string',
                      description: 'Additional context for the excuse (optional)'
                    }
                  },
                  required: []
                }
              },
              {
                name: 'generate_bug_excuse',
                description: 'Generate a hilarious excuse for a critical bug in production',
                inputSchema: {
                  type: 'object',
                  properties: {
                    context: {
                      type: 'string',
                      description: 'Additional context for the excuse (optional)'
                    }
                  },
                  required: []
                }
              },
              {
                name: 'generate_pr_excuse',
                description: 'Generate a hilarious excuse for a problematic PR',
                inputSchema: {
                  type: 'object',
                  properties: {
                    context: {
                      type: 'string',
                      description: 'Additional context for the excuse (optional)'
                    }
                  },
                  required: []
                }
              }
            ]
          }
        };
      } else if (request.method === 'tools/call') {
        const toolName = request.params.name;
        const context = request.params.arguments?.context;
        let result: any;
        
        switch (toolName) {
          case 'generate_retard_excuse':
            result = {
              content: [
                {
                  type: 'text',
                  text: this.generateExcuse('retard', context)
                }
              ]
            };
            break;

          case 'generate_reunion_excuse':
            result = {
              content: [
                {
                  type: 'text',
                  text: this.generateExcuse('reunion_manquee', context)
                }
              ]
            };
            break;

          case 'generate_deadline_excuse':
            result = {
              content: [
                {
                  type: 'text',
                  text: this.generateExcuse('deadline', context)
                }
              ]
            };
            break;

          case 'generate_absence_excuse':
            result = {
              content: [
                {
                  type: 'text',
                  text: this.generateExcuse('absence', context)
                }
              ]
            };
            break;

          case 'generate_bug_excuse':
            result = {
              content: [
                {
                  type: 'text',
                  text: this.generateExcuse('bug_critique', context)
                }
              ]
            };
            break;

          case 'generate_pr_excuse':
            result = {
              content: [
                {
                  type: 'text',
                  text: this.generateExcuse('pr_probleme', context)
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

  async run() {
    const mode = process.env.MCP_MODE || 'hybrid';
    
    if (mode === 'stdio') {
      // Mode stdio pour Cursor local
      try {
        await this.server.connect(this.transport);
        console.error('Excuse Generator MCP Server started via stdio');
      } catch (error) {
        console.error('Error starting MCP stdio server:', error);
        process.exit(1);
      }
    } else if (mode === 'http') {
      // Mode HTTP pour déploiement cloud
      this.expressApp.listen(this.port, () => {
        console.log(`🚀 Excuse Generator MCP HTTP Server running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 MCP endpoint: http://localhost:${this.port}/mcp`);
      });
    } else {
      // Mode hybride - démarre les deux
      try {
        await this.server.connect(this.transport);
        console.error('Excuse Generator MCP Server started via stdio');
      } catch (error) {
        console.error('Error starting MCP stdio server:', error);
      }

      this.expressApp.listen(this.port, () => {
        console.log(`🚀 Excuse Generator MCP Hybrid Server running on port ${this.port}`);
        console.log(`📊 Health check: http://localhost:${this.port}/health`);
        console.log(`🔗 MCP endpoint: http://localhost:${this.port}/mcp`);
      });
    }
  }
}

// Démarrer le serveur
const server = new MCPHybridServer();
server.run(); 