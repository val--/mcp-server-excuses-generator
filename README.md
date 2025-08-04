# Générateur d'Excuses Débiles MCP Server

Un serveur MCP (Model Context Protocol) hybride qui génère des excuses loufoques et humoristiques pour différents scénarios en entreprise.

## 🚀 Fonctionnalités

- **Serveur MCP hybride** : Support stdio (Cursor local) + HTTP (Cloud)
- **6 outils d'excuses loufoques** : Retard, réunion manquée, deadline, absence, bug critique, PR problématique
- **Déploiement Google Cloud** : Cloud Run, App Engine, Cloud Build
- **Configuration flexible** : Variables d'environnement pour différents modes

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Google Cloud SDK (pour le déploiement)

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <your-repo-url>
   cd mcp-server
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration**
   ```bash
   cp env.example .env
   # Éditer .env avec vos paramètres
   ```

4. **Build du projet**
   ```bash
   npm run build
   ```

## 🔧 Modes de fonctionnement

### Mode stdio (Cursor local)
```bash
npm run start:stdio-only
```

### Mode HTTP (Tests/Déploiement)
```bash
npm run start:http
```

### Mode hybride (Les deux)
```bash
npm run start:hybrid
```

## 🎭 Outils d'excuses disponibles

### 1. generate_retard_excuse
Génère une excuse loufoque pour un retard.

**Exemple :**
- "Désolé, j'ai été téléporté dans une dimension parallèle pendant 2 heures."

### 2. generate_reunion_excuse
Génère une excuse loufoque pour une réunion manquée.

**Exemple :**
- "Désolé d'avoir manqué cette réunion, j'ai été kidnappé par des pirates informatiques."

### 3. generate_deadline_excuse
Génère une excuse loufoque pour un retard sur une deadline.

**Exemple :**
- "Désolé pour ce retard sur la deadline, j'ai été kidnappé par des bugs qui voulaient des vacances."

### 4. generate_absence_excuse
Génère une excuse loufoque pour une absence.

**Exemple :**
- "Désolé pour cette absence, j'ai été transformé en licorne et j'ai dû apprendre à voler."

### 5. generate_bug_excuse
Génère une excuse loufoque pour un bug critique en production.

**Exemple :**
- "Désolé pour ce bug critique, j'ai été kidnappé par des gremlins du code."

### 6. generate_pr_excuse
Génère une excuse loufoque pour une PR problématique.

**Exemple :**
- "Désolé pour ce problème dans ma PR, j'ai été kidnappé par des reviewers trop stricts."

## 🐳 Docker

### Build local
```bash
docker build -t mcp-server .
docker run -p 3000:3000 mcp-server
```

### Test avec Docker Compose
```bash
docker-compose up
```

## ☁️ Déploiement Google Cloud

### Option 1: Cloud Run (recommandé)
```bash
./deploy-cloud.sh cloud-run
```

### Option 2: App Engine
```bash
./deploy-cloud.sh app-engine
```

### Option 3: Cloud Build
```bash
./deploy-cloud.sh cloud-build
```

## ⚙️ Configuration Cursor

### Serveur local (stdio)
```json
{
  "mcpServers": {
    "excuse-generator": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/mcp-hybrid-server.js"],
      "env": {
        "NODE_ENV": "production",
        "MCP_MODE": "stdio"
      },
      "cwd": "/path/to/mcp-server"
    }
  }
}
```

### Serveur distant (HTTP)
```json
{
  "mcpServers": {
    "remote-excuse-generator": {
      "url": "https://your-app-url.run.app/mcp"
    }
  }
}
```

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|---------|
| `MCP_MODE` | Mode du serveur (stdio/http/hybrid) | hybrid |
| `PORT` | Port du serveur HTTP | 3000 |
| `NODE_ENV` | Environnement Node.js | development |
| `LOG_LEVEL` | Niveau de log | info |

## 📡 API Endpoints

- `GET /` - Informations du serveur
- `GET /health` - Health check
- `POST /mcp` - Endpoint MCP principal

## 🧪 Tests

```bash
# Test complet du serveur
node test-server.js

# Test des différents modes
npm run start:stdio-only  # Test stdio
npm run start:http        # Test HTTP
npm run start:hybrid      # Test hybride
```

## 🚀 Scripts utiles

```bash
# Développement
npm run dev:hybrid          # Mode hybride
npm run dev:stdio           # Mode stdio
npm run dev                 # Serveur Express original

# Production
npm run start:hybrid        # Mode hybride
npm run start:stdio-only    # Mode stdio uniquement
npm run start:http          # Mode HTTP uniquement
npm start                   # Serveur Express original

# Déploiement
./deploy-cloud.sh           # Déploiement Cloud Run
./deploy-cloud.sh app-engine # Déploiement App Engine
./deploy-cloud.sh cloud-build # Déploiement Cloud Build

# Tests
node test-server.js         # Test complet
npm test                    # Tests unitaires
```

## 🎭 Utilisation dans Cursor

Une fois configuré, vous pouvez utiliser les outils dans Cursor :

```
Génère une excuse loufoque pour un retard
Génère une excuse loufoque pour un bug critique
Génère une excuse loufoque pour une deadline manquée avec le contexte "projet urgent"
```

## 📚 Documentation

- [Guide de configuration Cursor](CURSOR_SETUP.md)
- [Guide de déploiement Google Cloud](CLOUD_SETUP.md)
- [Guide du générateur d'excuses](EXCUSE_GENERATOR_GUIDE.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails. 