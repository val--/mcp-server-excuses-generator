# Configuration MCP pour Cursor

Ce guide explique comment configurer le serveur MCP avec Cursor pour une meilleure expérience de développement.

## 🚀 Installation

1. **Build du serveur**
   ```bash
   npm run build
   ```

2. **Démarrer le serveur localement**
   ```bash
   npm start
   ```

## ⚙️ Configuration Cursor

### Option 1: Configuration via fichier JSON

1. Créez un fichier `.cursorrules` dans votre projet :
   ```json
   {
     "mcpServers": {
       "simple-mcp-server": {
         "command": "node",
         "args": ["dist/index.js"],
         "env": {
           "NODE_ENV": "production",
           "PORT": "3000"
         }
       }
     }
   }
   ```

### Option 2: Configuration via settings.json

1. Ouvrez les paramètres Cursor (Ctrl/Cmd + ,)
2. Recherchez "MCP" ou "Model Context Protocol"
3. Ajoutez la configuration suivante :

```json
{
  "mcp.servers": {
    "simple-mcp-server": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "PORT": "3000"
      }
    }
  }
}
```

## 🔧 Outils disponibles

Une fois configuré, vous pourrez utiliser ces outils dans Cursor :

### 1. get_time
Obtenir l'heure actuelle en format ISO.

**Utilisation :**
```
Peux-tu me donner l'heure actuelle ?
```

### 2. calculate
Effectuer des calculs mathématiques simples.

**Utilisation :**
```
Calcule 2 + 3 * 4
```

### 3. echo
Écho d'un message.

**Utilisation :**
```
Écho "Hello World"
```

## 🧪 Test de la configuration

1. **Démarrer le serveur**
   ```bash
   npm start
   ```

2. **Tester avec curl**
   ```bash
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
   ```

3. **Vérifier dans Cursor**
   - Ouvrez Cursor
   - Essayez de demander l'heure actuelle
   - Le serveur MCP devrait répondre

## 🔍 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier les logs
npm run dev

# Vérifier le port
lsof -i :3000
```

### Cursor ne reconnaît pas le serveur
1. Vérifiez que le serveur est en cours d'exécution
2. Redémarrez Cursor
3. Vérifiez la configuration MCP dans les paramètres

### Erreurs de build
```bash
# Nettoyer et rebuilder
rm -rf dist/
npm run build
```

## 📊 Monitoring

Le serveur expose plusieurs endpoints pour le monitoring :

- `GET /health` - Health check
- `GET /` - Informations du serveur
- `POST /mcp` - Endpoint MCP principal

## 🚀 Déploiement

Pour déployer sur Google Cloud et utiliser le serveur distant :

1. **Déployer**
   ```bash
   ./deploy.sh cloud-run
   ```

2. **Configurer Cursor pour le serveur distant**
   ```json
   {
     "mcp.servers": {
       "remote-mcp-server": {
         "url": "https://your-app-url.run.app/mcp"
       }
     }
   }
   ```

## 📝 Notes

- Le serveur utilise le port 3000 par défaut
- Les outils sont sécurisés et ne permettent que des opérations basiques
- En production, utilisez un évaluateur d'expressions sécurisé pour `calculate`
- Le serveur supporte le protocole JSON-RPC 2.0 