# Générateur d'Excuses Loufoques MCP Server

Un serveur MCP (Model Context Protocol) hybride qui génère des excuses loufoques et humoristiques pour différents scénarios en entreprise.

## 🚀 Fonctionnalités

- **Serveur MCP hybride** : Support stdio (Cursor local) + HTTP (Cloud)
- **6 outils d'excuses loufoques** : Retard, réunion manquée, deadline, absence, bug critique, PR problématique
- **Déploiement Google Cloud** : Cloud Run, App Engine, Cloud Build
- **Configuration flexible** : Variables d'environnement pour différents modes
- **Monitoring complet** : Health checks, logs, métriques

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

**Exemples :**
- "Désolé, j'ai été téléporté dans une dimension parallèle pendant 2 heures."
- "Je m'excuse, j'ai dû sauver un chaton coincé dans un arbre sur le chemin."
- "Désolé pour ce retard, j'ai été attaqué par un troupeau de moutons enragés."

### 2. generate_reunion_excuse
Génère une excuse loufoque pour une réunion manquée.

**Exemples :**
- "Désolé d'avoir manqué cette réunion, j'ai été kidnappé par des pirates informatiques."
- "Je m'excuse, j'ai dû participer à un tournoi de rock-paper-scissors avec des IA."
- "Désolé, j'ai été transformé en chat et j'ai oublié comment utiliser Teams."

### 3. generate_deadline_excuse
Génère une excuse loufoque pour un retard sur une deadline.

**Exemples :**
- "Désolé pour ce retard sur la deadline, j'ai été kidnappé par des bugs qui voulaient des vacances."
- "Je m'excuse, j'ai dû apprendre à parler le langage des serveurs en détresse."
- "Je m'excuse, j'ai dû apprendre à danser avec les logs d'erreur."

### 4. generate_absence_excuse
Génère une excuse loufoque pour une absence.

**Exemples :**
- "Désolé pour cette absence, j'ai été transformé en licorne et j'ai dû apprendre à voler."
- "Je m'excuse, j'ai été kidnappé par des pandas qui voulaient apprendre Python."
- "Désolé, j'ai été téléporté dans un monde où les bugs n'existent pas."

### 5. generate_bug_excuse
Génère une excuse loufoque pour un bug critique en production.

**Exemples :**
- "Désolé pour ce bug critique, j'ai été kidnappé par des gremlins du code."
- "Je m'excuse, c'est la faute des elfes qui ont modifié mon code pendant la nuit."
- "Je m'excuse, c'est la faute d'un magicien qui a jeté un sort sur mon code."

### 6. generate_pr_excuse
Génère une excuse loufoque pour une PR problématique.

**Exemples :**
- "Désolé pour ce problème dans ma PR, j'ai été kidnappé par des reviewers trop stricts."
- "Je m'excuse, j'ai été transformé en code legacy et j'ai mis du temps à me moderniser."
- "Désolé, c'est la faute d'un troll qui a modifié mes tests pendant la nuit."

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

## 📊 Monitoring

Le serveur expose plusieurs endpoints pour le monitoring :

- `GET /health` - Health check avec timestamp
- `GET /` - Informations du serveur et mode actuel
- `POST /mcp` - Endpoint MCP principal

## 🔒 Sécurité

- Utilisateur non-root dans Docker
- Validation des entrées
- CORS configuré
- Health checks intégrés
- Variables d'environnement sécurisées

## 📝 Structure du projet

```
mcp-server/
├── src/
│   ├── index.ts              # Serveur Express original
│   ├── mcp-server.ts         # Serveur MCP HTTP
│   ├── mcp-stdio-server.ts   # Serveur MCP stdio
│   └── mcp-hybrid-server.ts  # Serveur MCP hybride (excuses loufoques)
├── dist/                     # Code compilé
├── Dockerfile               # Configuration Docker
├── app.yaml                 # Configuration App Engine
├── cloudbuild.yaml          # Configuration Cloud Build
├── deploy.sh                # Script de déploiement original
├── deploy-cloud.sh          # Script de déploiement hybride
└── package.json             # Dépendances
```

## 📚 Documentation

- [Guide de configuration Cursor](CURSOR_SETUP.md)
- [Guide de déploiement Google Cloud](CLOUD_SETUP.md)
- [Guide du générateur d'excuses](EXCUSE_GENERATOR_GUIDE.md)

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

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails. 