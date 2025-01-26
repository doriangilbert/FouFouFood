# Serveur de l'application FouFouFood

## Table des matières

- [Serveur de l'application FouFouFood](#serveur-de-lapplication-foufoufood)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
    - [Contenu](#contenu)
      - [Structure](#structure)
      - [Fonctionnalités](#fonctionnalités)
  - [Manuel de l'utilisateur](#manuel-de-lutilisateur)
    - [Outils nécessaires](#outils-nécessaires)
    - [Installation et exécution](#installation-et-exécution)

## Présentation

Serveur de l'application lié au différents clients permettant de manipuler les données et de fournir les différentes fonctionnalités de l'application via une API REST. Ce serveur est lié à une base de données MongoDB stockée dans le cloud MongoDB Atlas. Cette partie a été developpée avec JavaScript et utilise Node\.js, Express\.js, Mongoose et Socket\.io.

### Contenu

#### Structure

Le serveur est construit selon une architecture inspirée du patron architectural Model-View-Controller (MVC).

Les différentes parties du serveur sont les suivantes :

- Le fichier [app.js](./app.js) contenant la logique principale du serveur. Nous y trouverons des éléments comme la connexion à la base de données, la déclaration des différentes routes principales, la route de base (/) ou encore la mise en écoute du serveur sur les ports.
- Le répertoire [models](./models/) contenant les différentes entités manipulables par l'application. Ces entités sont représentées par des schémas Mongoose permettant la liaison avec la base de données MongoDB. Les entités pouvant être représentées dans l'application sont : les utilisateurs, les restaurants, les commandes et les plats.
- Le répertoire [controllers](./controllers/) contenant les différents controleurs composés de méthodes pouvant être appelées par les routes afin d'exécuter la logique métier qu'elles contiennent afin d'agir sur les entités représentées par les modèles.
- Le répertoire [routes](./routes/) contenant les différentes routes accessibles depuis les différents clients ou via un client d'API tel que Postman. Certaines peuvent nécessiter d'être authentifié ou de posséder un rôle spécifique. En appelant ces routes, ce seront les méthodes définies dans le controleur associé qui seront appelées.
- Le répertoire [middlewares](./middlewares/) contenant les middlewares d'authentification qui vont être exécutés lors de l'appel des routes pour vérifier si nécessaire l'authentification de l'utilisateur ou son accès ou non en fonction de son rôle.
- Le répertoire [utils](./utils/) contenant les utilitaires permettant de servir des fonctions annexes de l'application telles que la prise en charge de notifications ou du formatage des données au format RDF.
- Les fichiers [db.js](./db.js) et [index.html](./index.html) étant utilisés à des fins de tests, le premier pour tester et peupler la base de données et le second pour tester la réception de notifications.

#### Fonctionnalités

Ce serveur fournit les services suivants :

- Opérations élémentaires de création, de consultation, de mise à jour et de suppression des entités de base (utilisateur, restaurant, commande et plat)
- Création d'un compte
- Connexion à un compte
- Assignation d'une commande à un livreur
- Changement de statut du commande
- Recherche de restaurant ou de plat
- Envoi de notifications à un utilisateur lors d'un changement dans une commande, mise à jour de la commande pour un utilisateur standard ou assignation pour un livreur
- Consultation des données au format HTML ou RDF

## Manuel de l'utilisateur

### Outils nécessaires

- Terminal sur la machine serveur
- Client Android, Web ou Web sémantique
- Client API (ex: Postman) (facultatif, à des fins de tests)

### Installation et exécution

0. Créer un fichier .env à la racine contenant l'URI de la base de données MongoDB (il est recommandé de l'héberger sur MongoDB Atlas) et un secret JWT. (uniquement à la première exécution)

Le fichier devra respecter le format suivant :

```text
DB_URI=<uri de la base de données MongoDB>
JWT_SECRET=<secret JWT>
```

Note : Afin de faciliter les différents tests et éviter la modification du code du client Android, on propose le secret JWT suivant : ```59fb86093746ad23d25b9e44ea48da41e0360d2a99d4a7cad63311f77639dc0aad4940c04c3ded4aadee6b0844d017fd0d5409f00bbdc5b6a8861568778a6957```. Pour une utilisation réelle, il serait nécessaire de générer un secret JWT spécifique.

1. Exécuter dans un terminal les commandes suivantes :

```shell
npm install
npm run start
```

Note : Il est possible de tester la connexion à la base de données et de la peupler avec des données échantillon en se rendant dans le fichier [db.js](./db.js), en décommentant la ligne ```await addSampleData();``` en fin de fichier et en exécutant le fichier. Avertissement : L'opération de peuplement de la base écrase l'entièreté des données déjà présentes. Un compte administrateur est créé par défaut avec les identifiants ```admin``` et ```admin``` pour les tests.

2. Ouvrir un client Android, Web ou Web sémantique et l'utiliser.

Les étapes suivantes concernent l'utilisation par un client API tel que Postman.

3. Ouvrir un client API (ex : Postman) et préfixer toutes les routes par ```http://localhost:3000``` pour une utilisation normale ou par ```http://localhost:8080``` pour la réception de notifications. Préciser la méthode HTTP ainsi que les potentiels arguments en paramètre de l'URL ou dans le corps de la requête.

Les routes primaires sont les suivantes :

- ```/users``` : Pour les utilisateurs
- ```/restaurants``` : Pour les restaurants
- ```/menuitems``` : Pour les plats
- ```/restaurants/\<id du restaurant\>/menuitems``` : Pour les plats d'un restaurant donné
- ```/deliverypartners``` : Pour les livreurs
- ```/orders``` : Pour les commandes
- ```/search``` : Pour la recherche
- ```/notifications``` : Pour les notifications (à utiliser sur le port 8080 en suivant par ```\<id de l'utilisateur pour lequel recevoir les notifications>```)
- ```/data``` : Pour la récupération des données brutes au format HTML ou RDF (préciser l'entête Accept avec la valeur text/html ou application/rdf+xml)

Les routes secondaires associées à chacunes des routes primaires, leur méthode HTTP, arguments en paramètre de l'URL ou dans le corps de la requête sont détaillées dans les fichiers des répertoires [routes](./routes/) et [controllers](./controllers/).
