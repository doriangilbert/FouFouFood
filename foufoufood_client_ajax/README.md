# Client web AJAX de l'application FouFouFood

## Table des matières

- [Client web AJAX de l'application FouFouFood](#client-web-ajax-de-lapplication-foufoufood)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
    - [Contenu](#contenu)
      - [Structure](#structure)
      - [Fonctionnalités](#fonctionnalités)
  - [Manuel de l'utilisateur](#manuel-de-lutilisateur)
    - [Outils nécessaires](#outils-nécessaires)
    - [Installation et exécution](#installation-et-exécution)

## Présentation

Client web AJAX de l'application FouFouFood lié au serveur permettant aux utilisateurs de consulter les différents restaurants et plats et de placer une commande. Ce client a été développé avec HTML, CSS et JavaScript et utilise Bootstrap.

### Contenu

#### Structure

Le client web est organisé de la manière suivante :

- Les fichiers HTML contenant les code des différentes pages du client.
- Le répertoire [styles](./styles/) contenant les fichiers de style CSS pour la mise en forme des pages.
- Le répertoire [scripts](./scripts/) contenant les scripts JavaScript pour la logique du client et des pages et les requêtes AJAX vers le serveur.
- Le répertoire [images](./images/) contenant les images utilisées dans le client.
- Le fichier [service-worker.js](./service-worker.js) pour la gestion du service worker permettant le fonctionnement hors ligne du client.

#### Fonctionnalités

Ce client web fournit les fonctionnalités suivantes :

- Consultation des restaurants et des plats
- Ajout des plats à commander dans un panier
- Placement d'une commande
- Création d'un compte
- Connexion à un compte
- Déconnexion d'un compte
- Consultation des informations du compte connecté
- Consultation des commandes passées
- Réception de notifications
- Consultation des différentes informations en mode hors ligne

## Manuel de l'utilisateur

### Outils nécessaires

- Navigateur web
- Terminal sur la machine cliente (facultatif, il devrait être possible d'exécuter le client sans terminal)

### Installation et exécution

0. S'assurer que le serveur de l'application est en cours d'exécution et l'exécuter si ce n'est pas le cas.

1. Exécuter les commandes suivantes dans un terminal :

```shell
npm install
npm run start
```

2. Ouvrir un navigateur web à l'adresse ```http://localhost:80```.

Note : Il devrait être possible d'exécuter le client sans terminal en ouvrant directement le fichier [index.html](./index.html) dans un navigateur web.
