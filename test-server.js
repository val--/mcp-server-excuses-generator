#!/usr/bin/env node

// Script de test pour le serveur MCP
import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Test du serveur MCP...\n');

  try {
    // Test 1: Health check
    console.log('1. Test du health check...');
    const health = await testEndpoint('/health');
    console.log(`   ✅ Status: ${health.status}`);
    console.log(`   📊 Response: ${JSON.stringify(health.data)}\n`);

    // Test 2: Root endpoint
    console.log('2. Test du endpoint racine...');
    const root = await testEndpoint('/');
    console.log(`   ✅ Status: ${root.status}`);
    console.log(`   📊 Response: ${JSON.stringify(root.data)}\n`);

    // Test 3: List tools
    console.log('3. Test de la liste des outils...');
    const listTools = await testEndpoint('/mcp', 'POST', {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    });
    console.log(`   ✅ Status: ${listTools.status}`);
    console.log(`   📊 Tools: ${listTools.data.result.tools.length} outils trouvés\n`);

    // Test 4: Get time tool
    console.log('4. Test de l\'outil get_time...');
    const getTime = await testEndpoint('/mcp', 'POST', {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'get_time',
        arguments: {}
      }
    });
    console.log(`   ✅ Status: ${getTime.status}`);
    console.log(`   📊 Time: ${getTime.data.result.content[0].text}\n`);

    // Test 5: Calculate tool
    console.log('5. Test de l\'outil calculate...');
    const calculate = await testEndpoint('/mcp', 'POST', {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'calculate',
        arguments: {
          expression: '2 + 3 * 4'
        }
      }
    });
    console.log(`   ✅ Status: ${calculate.status}`);
    console.log(`   📊 Result: ${calculate.data.result.content[0].text}\n`);

    // Test 6: Echo tool
    console.log('6. Test de l\'outil echo...');
    const echo = await testEndpoint('/mcp', 'POST', {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'echo',
        arguments: {
          message: 'Hello MCP Server!'
        }
      }
    });
    console.log(`   ✅ Status: ${echo.status}`);
    console.log(`   📊 Echo: ${echo.data.result.content[0].text}\n`);

    console.log('🎉 Tous les tests sont passés avec succès!');
    console.log('🚀 Le serveur MCP est prêt pour le déploiement.');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    process.exit(1);
  }
}

// Vérifier si le serveur est en cours d'exécution
async function checkServer() {
  try {
    await testEndpoint('/health');
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('⚠️  Le serveur ne semble pas être en cours d\'exécution.');
    console.log('   Démarrez le serveur avec: npm run dev');
    console.log('   Ou avec: node --loader ts-node/esm src/index.ts');
    process.exit(1);
  }

  await runTests();
}

main(); 