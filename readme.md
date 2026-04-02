# 📄 Générateur de Notes de Frais & Abandon de Frais

Une application web complète permettant de générer facilement des notes de frais (remboursements) ou des abandons de frais (reçus fiscaux).

Le projet est divisé en deux parties : une interface utilisateur en HTML/JS natif et un backend en Java (Quarkus) pour la sauvegarde en base de données et l'envoi de mails.

## ✨ Fonctionnalités

- **Calcul Automatique :** Intégration des barèmes kilométriques officiels (voitures et motos) selon qu'il s'agisse d'une note de frais ou d'un abandon de frais.
- **Ajout de Dépenses Multiples :** Gestion dynamique des lignes de dépenses (péages, matériel, etc.) avec recalcul en temps réel.
- **Signature Électronique :** Pavé de signature tactile et compatible souris intégré directement dans le navigateur.
- **Gestion des Justificatifs :** Upload et prévisualisation immédiate des tickets de caisse via lecteur local.
- **Génération PDF :** Création instantanée d'un PDF structuré côté client (via `html2pdf.js`) qui peut être envoyé au mail de l'utilisateur directement depuis le front.

## 🛠️ Technologies Utilisées

**Frontend :**

- HTML5 / CSS3
- JavaScript
- [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/) (Génération PDF côté client)

**Backend :**

- Java 25+
- [Quarkus](https://quarkus.io/) (Framework Java)
- Hibernate ORM / Panache
- Base de données MySQL
- Quarkus Mailer (Serveur SMTP)

## 🚀 Installation et Lancement

### 1. Prérequis

- Java 25+ et Maven installés sur votre machine.
- Une base de données MySQL locale active (port 3306) nommée `notes_frais_db`.
- Un serveur web local basique (ex: l'extension Live Server sur VS Code) pour lancer le Frontend.

### 2. Configuration de la sécurité (Fichier `.env`)

Pour des raisons de sécurité, les identifiants de base de données et de messagerie ne sont pas présents sur ce dépôt public.
Créez un fichier nommé `.env` à la racine du dossier Backend (au même niveau que le dossier `src`) contenant vos variables :

```env
MAILER_EMAIL=votre_email_asso@gmail.com
MAILER_PASSWORD=votre_mot_de_passe_d_application
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_sql
```

### 3. Lancer le Backend (Serveur Quarkus)

1. Ouvrez un terminal dans le dossier contenant le projet Java (où se trouve le fichier `pom.xml`).
2. Démarrez le serveur en mode développement avec la commande :
   ```bash
   ./mvnw compile quarkus:dev
   (Note : sous Windows, si le wrapper ./mvnw ne fonctionne pas, utilisez simplement mvn compile quarkus:dev)
   ```
3. Le backend tourne désormais et écoute sur http://localhost:8080. Les tables SQL seront générées automatiquement au démarrage.

### 4. Lancer le Frontend

1. Ouvrez le dossier contenant vos fichiers web (index.html, app.css, app.js) dans votre éditeur de code (ex: VS Code).
2. Lancez un serveur local pour éviter les problèmes de sécurité CORS de votre navigateur. Avec VS Code, faites un clic droit sur index.html et choisissez "Open with Live Server".
3. L'application s'ouvre automatiquement dans votre navigateur, généralement à l'adresse http://127.0.0.1:5500.

## 📂 Structure du Projet

1. /generateurFront/ : Contient l'interface utilisateur.
   index.html : L'interface principale du formulaire et la structure cachée du PDF.
   app.css : La mise en forme de l'application et la feuille de style spécifique à l'impression PDF.
   app.js : Toute la logique métier (calculs, gestion des événements, génération Base64 et appels API).
2. /generateurBack/src/main/java/org/acme/ : Le code source du serveur Quarkus (Controllers, DTOs, Entités).
3. /generateurBack/src/main/resources/application.properties : Configuration principale du serveur Java (pontée avec le fichier .env).
