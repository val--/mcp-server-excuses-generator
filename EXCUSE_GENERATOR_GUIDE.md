# Guide du Générateur d'Excuses Professionnelles

Ce serveur MCP génère des excuses professionnelles pour différents scénarios courants en entreprise.

## 🚀 Outils disponibles

### 1. generate_retard_excuse
Génère une excuse pour un retard.

**Utilisation dans Cursor :**
```
Génère une excuse pour un retard
```

**Exemple de réponse :**
```
Je m'excuse sincèrement pour ce retard. J'ai été pris dans un embouteillage inattendu sur l'autoroute.
```

### 2. generate_reunion_excuse
Génère une excuse pour une réunion manquée.

**Utilisation dans Cursor :**
```
Génère une excuse pour une réunion manquée
```

**Exemple de réponse :**
```
Je m'excuse sincèrement d'avoir manqué cette réunion importante. J'avais un conflit d'agenda que je n'avais pas anticipé.
```

### 3. generate_deadline_excuse
Génère une excuse pour un retard sur une deadline.

**Utilisation dans Cursor :**
```
Génère une excuse pour un retard sur une deadline
```

**Exemple de réponse :**
```
Je m'excuse pour ce retard sur la deadline. J'ai rencontré des difficultés techniques inattendues qui ont ralenti le développement.
```

### 4. generate_absence_excuse
Génère une excuse pour une absence.

**Utilisation dans Cursor :**
```
Génère une excuse pour une absence
```

**Exemple de réponse :**
```
Je m'excuse pour cette absence inattendue. J'ai eu un problème de santé qui m'a empêché de venir.
```

### 5. generate_bug_excuse
Génère une excuse pour un bug critique en production.

**Utilisation dans Cursor :**
```
Génère une excuse pour un bug critique en production
```

**Exemple de réponse :**
```
Je m'excuse sincèrement pour ce bug critique en production. Malgré nos tests, nous n'avions pas anticipé ce cas d'usage particulier.
```

### 6. generate_pr_excuse
Génère une excuse pour une PR problématique.

**Utilisation dans Cursor :**
```
Génère une excuse pour une PR problématique
```

**Exemple de réponse :**
```
Je m'excuse pour ce problème causé par ma PR. J'ai fait une erreur dans la logique que je corrige immédiatement.
```

## 🔧 Utilisation avec contexte

Vous pouvez ajouter du contexte à vos excuses :

**Exemple :**
```
Génère une excuse pour un bug critique avec le contexte "Cela a impacté 1000 utilisateurs"
```

**Réponse :**
```
Je m'excuse sincèrement pour ce bug critique en production. Malgré nos tests, nous n'avions pas anticipé ce cas d'usage particulier. Cela a impacté 1000 utilisateurs.
```

## 📋 Scénarios d'utilisation

### Retard au travail
- Embouteillage
- Problème de transport
- Urgence familiale
- Problème technique

### Réunion manquée
- Conflit d'agenda
- Problème technique
- Urgence médicale
- Problème de connexion

### Deadline manquée
- Difficultés techniques
- Changements de spécifications
- Problèmes de santé
- Urgences prioritaires

### Absence
- Problème de santé
- Urgence familiale
- Problème de transport
- Rendez-vous médical

### Bug en production
- Edge case non testé
- Problème de configuration
- Dépendance externe
- Problème de performance

### PR problématique
- Erreur de logique
- Refactoring problématique
- Test manquant
- Conflit de dépendances

## 🎯 Conseils d'utilisation

1. **Soyez honnête** : Les excuses sont professionnelles mais restez honnête
2. **Ajoutez du contexte** : Personnalisez avec des détails spécifiques
3. **Proposez des solutions** : Accompagnez l'excuse d'un plan d'action
4. **Apprenez** : Utilisez ces excuses pour améliorer vos processus

## 🚀 Déploiement

### Local
```bash
npm run start:stdio-only
```

### Google Cloud
```bash
./deploy-cloud.sh
```

## 📊 Monitoring

Le serveur expose des endpoints de monitoring :
- `GET /health` - Health check
- `GET /` - Informations du serveur
- `POST /mcp` - Endpoint MCP principal

## 🔒 Sécurité

- Les excuses sont générées localement
- Aucune donnée personnelle n'est stockée
- Utilisez avec discernement en entreprise

## 📝 Notes

- Les excuses sont générées aléatoirement parmi une liste prédéfinie
- Chaque type d'excuse a 5 variantes différentes
- Le contexte est ajouté à la fin de l'excuse
- Le serveur supporte les modes stdio et HTTP 