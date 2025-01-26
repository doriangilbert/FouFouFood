# Client web sémantique de l'application FouFouFood

## Table des matières

- [Client web sémantique de l'application FouFouFood](#client-web-sémantique-de-lapplication-foufoufood)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
    - [Contenu](#contenu)
      - [Structure](#structure)
      - [Fonctionnalités](#fonctionnalités)
  - [Manuel de l'utilisateur](#manuel-de-lutilisateur)
    - [Outils nécessaires](#outils-nécessaires)
    - [Installation et exécution](#installation-et-exécution)

## Présentation

Client web sémantique de l'application FouFouFood lié au serveur permettant aux utilisateurs de consulter les données brutes au format HTML et au format RDF via l'API. Ce client a été développé avec HTML, CSS et JavaScript.

### Contenu

#### Structure

Le client web est organisé de la manière suivante :

- La fichier [index.html](./index.html) contenant la structure HTML du client.
- Le répertoire [styles](./styles/) contenant le fichier de style CSS pour la mise en forme du client.
- Le répertoire [scripts](./scripts/) contenant le script JavaScript pour la logique du client.
- Le répertoire [images](./images/) contenant les images utilisées dans le client.

#### Fonctionnalités

Ce client web sémantique fournit les fonctionnalités suivantes :

- Consultation des données brutes au format HTML concernant les restaurants, les plats et les commandes.

## Manuel de l'utilisateur

### Outils nécessaires

- Navigateur web

### Installation et exécution

0. S'assurer que le serveur de l'application est en cours d'exécution et l'exécuter si ce n'est pas le cas.

1. Ouvrir le fichier [index.html](./index.html) dans un navigateur web.

Note : Pour consulter les données brutes au format RDF il est nécessaire d'utiliser la route primaire ```data``` de l'API en précisant l'en-tête ```Accept: application/rdf+xml``` (pour le format HTML on utilisera ```Accept: text/html```). Le détail des routes est disponible dans le fichier [dataRoutes.js](../foufoufood_serveur/routes/dataRoutes.js) du serveur.
