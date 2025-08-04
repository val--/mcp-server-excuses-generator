#!/bin/bash

# Script de déploiement Google Cloud avec serveur MCP hybride
set -e

echo "🚀 Déploiement du serveur MCP hybride sur Google Cloud..."

# Vérifier que gcloud est installé
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que le projet est configuré
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Aucun projet Google Cloud configuré."
    echo "Utilisez: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Projet configuré: $PROJECT_ID"

# Build du projet
echo "🔨 Build du projet..."
npm run build

# Option 1: Déploiement sur Cloud Run (recommandé)
if [ "$1" = "cloud-run" ] || [ -z "$1" ]; then
    echo "☁️ Déploiement sur Cloud Run..."
    
    # Activer les APIs nécessaires
    gcloud services enable run.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    
    # Déployer sur Cloud Run avec le serveur hybride
    gcloud run deploy mcp-server \
        --source . \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated \
        --port 3000 \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --min-instances 0 \
        --set-env-vars MCP_MODE=http,NODE_ENV=production
    
    echo "✅ Serveur MCP hybride déployé sur Cloud Run!"
    echo "🌐 URL: https://mcp-server-$(gcloud config get-value project).us-central1.run.app"

# Option 2: Déploiement sur App Engine
elif [ "$1" = "app-engine" ]; then
    echo "☁️ Déploiement sur App Engine..."
    
    # Activer l'API App Engine
    gcloud services enable appengine.googleapis.com
    
    # Déployer sur App Engine
    gcloud app deploy
    
    echo "✅ Serveur MCP hybride déployé sur App Engine!"
    echo "🌐 URL: https://$(gcloud config get-value project).appspot.com"

# Option 3: Déploiement avec Cloud Build
elif [ "$1" = "cloud-build" ]; then
    echo "☁️ Déploiement avec Cloud Build..."
    
    # Activer les APIs nécessaires
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    
    # Déclencher le build
    gcloud builds submit --config cloudbuild.yaml
    
    echo "✅ Serveur MCP hybride déployé avec Cloud Build!"

else
    echo "❌ Option de déploiement invalide."
    echo "Options disponibles:"
    echo "  ./deploy-cloud.sh cloud-run    (défaut)"
    echo "  ./deploy-cloud.sh app-engine"
    echo "  ./deploy-cloud.sh cloud-build"
    exit 1
fi

echo "🎉 Déploiement terminé!"
echo "📊 Pour vérifier le statut: gcloud app logs tail -s default"
echo ""
echo "🔧 Configuration Cursor pour serveur distant:"
echo "Ajoutez cette configuration dans Cursor:"
echo "{"
echo "  \"mcpServers\": {"
echo "    \"remote-mcp-server\": {"
echo "      \"url\": \"https://your-app-url.run.app/mcp\""
echo "    }"
echo "  }"
echo "}" 