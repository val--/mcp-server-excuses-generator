# Configuration MCP avec Google Cloud

Ce guide explique comment déployer le serveur MCP sur Google Cloud et le configurer avec Cursor.

## 🚀 Architecture

Le serveur MCP hybride supporte deux modes :

1. **Mode stdio** : Pour Cursor local (communication via stdin/stdout)
2. **Mode HTTP** : Pour déploiement cloud (communication via HTTP)

## 📋 Déploiement Google Cloud

### 1. Préparation

```bash
# Build du projet
npm run build

# Vérifier que gcloud est configuré
gcloud config set project YOUR_PROJECT_ID
```

### 2. Déploiement

```bash
# Déploiement sur Cloud Run (recommandé)
./deploy-cloud.sh cloud-run

# Ou déploiement sur App Engine
./deploy-cloud.sh app-engine

# Ou déploiement avec Cloud Build
./deploy-cloud.sh cloud-build
```

### 3. Vérification

Après le déploiement, testez votre serveur :

```bash
# Récupérer l'URL de votre service
gcloud run services describe mcp-server --region=us-central1 --format="value(status.url)"

# Tester le health check
curl https://your-app-url.run.app/health

# Tester l'endpoint MCP
curl -X POST https://your-app-url.run.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

## ⚙️ Configuration Cursor

### Option 1: Serveur local (stdio)

Pour utiliser le serveur local avec Cursor :

```json
{
  "mcpServers": {
    "simple-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/dist/mcp-hybrid-server.js"],
      "env": {
        "NODE_ENV": "production",
        "MCP_MODE": "stdio"
      },
      "cwd": "/path/to/your/mcp-server"
    }
  }
}
```

### Option 2: Serveur distant (HTTP)

Pour utiliser le serveur déployé sur Google Cloud :

```json
{
  "mcpServers": {
    "remote-mcp-server": {
      "url": "https://your-app-url.run.app/mcp"
    }
  }
}
```

### Option 3: Configuration hybride

Pour utiliser les deux serveurs :

```json
{
  "mcpServers": {
    "local-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/mcp-server/dist/mcp-hybrid-server.js"],
      "env": {
        "NODE_ENV": "production",
        "MCP_MODE": "stdio"
      },
      "cwd": "/path/to/your/mcp-server"
    },
    "remote-mcp-server": {
      "url": "https://your-app-url.run.app/mcp"
    }
  }
}
```

## 🔧 Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|---------|
| `MCP_MODE` | Mode du serveur (stdio/http/hybrid) | hybrid |
| `PORT` | Port pour le mode HTTP | 3000 |
| `NODE_ENV` | Environnement Node.js | development |

## 🧪 Test des modes

### Test mode stdio
```bash
# Démarrer en mode stdio
MCP_MODE=stdio node dist/mcp-hybrid-server.js

# Tester avec echo
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/mcp-hybrid-server.js
```

### Test mode HTTP
```bash
# Démarrer en mode HTTP
MCP_MODE=http node dist/mcp-hybrid-server.js

# Tester avec curl
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

### Test mode hybride
```bash
# Démarrer en mode hybride (les deux)
node dist/mcp-hybrid-server.js

# Tester HTTP
curl http://localhost:3000/health

# Tester stdio
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | node dist/mcp-hybrid-server.js
```

## 📊 Monitoring

### Health Check
```bash
curl https://your-app-url.run.app/health
```

### Logs Google Cloud
```bash
# Logs Cloud Run
gcloud logs tail --service=mcp-server

# Logs App Engine
gcloud app logs tail -s default
```

## 🔒 Sécurité

### Variables d'environnement sensibles
```bash
# Définir des variables d'environnement sécurisées
gcloud run services update mcp-server \
  --set-env-vars SECRET_KEY=your-secret-key \
  --region=us-central1
```

### Authentification (optionnel)
```bash
# Activer l'authentification pour Cloud Run
gcloud run services update mcp-server \
  --no-allow-unauthenticated \
  --region=us-central1
```

## 🚀 Scripts utiles

### Démarrage local
```bash
# Mode stdio pour Cursor
npm run start:stdio-only

# Mode HTTP pour tests
npm run start:http

# Mode hybride
npm run start:hybrid
```

### Déploiement
```bash
# Déploiement rapide
./deploy-cloud.sh

# Déploiement avec options
./deploy-cloud.sh cloud-run
./deploy-cloud.sh app-engine
./deploy-cloud.sh cloud-build
```

## 📝 Notes importantes

1. **Mode stdio** : Utilisé par Cursor local, communication via stdin/stdout
2. **Mode HTTP** : Utilisé pour déploiement cloud, communication via HTTP
3. **Mode hybride** : Démarre les deux modes simultanément
4. **Variables d'environnement** : Contrôlent le comportement du serveur
5. **Sécurité** : En production, utilisez HTTPS et authentification

## 🔍 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier les logs
npm run dev:hybrid

# Vérifier les variables d'environnement
echo $MCP_MODE
echo $PORT
```

### Cursor ne reconnaît pas le serveur distant
1. Vérifiez que l'URL est correcte
2. Testez l'endpoint avec curl
3. Vérifiez les logs Google Cloud

### Erreurs de déploiement
```bash
# Vérifier les permissions
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Vérifier les APIs activées
gcloud services list --enabled
``` 