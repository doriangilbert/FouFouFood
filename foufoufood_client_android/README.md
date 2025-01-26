# Client Android de l'application FouFouFood

## Table des matières

- [Client Android de l'application FouFouFood](#client-android-de-lapplication-foufoufood)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
    - [Contenu](#contenu)
      - [Structure](#structure)
      - [Fonctionnalités](#fonctionnalités)
  - [Manuel de l'utilisateur](#manuel-de-lutilisateur)
    - [Outils nécessaires](#outils-nécessaires)
    - [Installation et exécution](#installation-et-exécution)

## Présentation

Client Android de l'application FouFouFood lié au serveur permettant aux utilisateurs de consulter les différents restaurants et plats et de placer une commande. Cette partie a été developpée avec Kotlin et utilise Jetpack Compose.

### Contenu

#### Structure

L'application est construite selon une architecture MVVM (Model-View-ViewModel).

#### Fonctionnalités

Cette application fournit les fonctionnalités suivantes :

- Consultation des restaurants et des plats
- Ajout des plats à commander dans un panier
- Placement d'une commande

## Manuel de l'utilisateur

### Outils nécessaires

- Android Studio
- Un appareil Android ou un émulateur

### Installation et exécution

0. Effectuer la configuration initiale de l'adresse du serveur et du token JWT. (voir notes)

1. S'assurer que le serveur de l'application est en cours d'exécution et l'exécuter si ce n'est pas le cas.

2. Exécuter l'application depuis Android Studio dans un appareil Android ou un émulateur.

Note 1 : L'adresse du serveur est configurée par défaut pour se connecter au serveur en local, il est possible de la modifier dans le fichier [RetrofitInstance.kt](./app/src/main/java/com/example/foufoufood/RetrofitInstance.kt).

Note 2 : Afin d'effectuer des requêtes authentifiées lors des tests, un token JWT lié à un compte administrateur construit sur le secret JWT utilisé lors du développement a été défini dans les fichiers Repository dans le répertoire [model](./app/src/main/java/com/example/foufoufood/model/). Il sera donc nécessaire de générer un nouveau token administrateur avec le secret JWT défini dans le serveur avec une durée de vie illimitée (voir le fichier [authMiddleware.js](../foufoufood_serveur/middlewares/authMiddleware.js)) en modifiant le code dans le serveur pour spécifier cette durée de vie et en utilisant un client API pour se connecter avec des identifiants administrateur et récupérer le token. Afin de faciliter les tests et ne pas avoir à modifier le code, il est possible d'utiliser le secret JWT proposé dans la documentation du serveur. Il aurait été préférable d'utiliser une méthode plus sécurisée, mais cela n'a pas été implémenté dans le cadre de ce projet.
