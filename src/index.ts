import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MCPServer } from './mcp-server.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MCP Server
const mcpServer = new MCPServer();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MCP endpoint
app.post('/mcp', async (req, res) => {
  try {
    const response = await mcpServer.handleRequest(req.body);
    res.json(response);
  } catch (error) {
    console.error('MCP request error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'MCP Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      mcp: '/mcp'
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 MCP Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔗 MCP endpoint: http://localhost:${port}/mcp`);
}); 