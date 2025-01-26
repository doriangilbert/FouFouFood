# FouFouFood

## Table des matières

- [FouFouFood](#foufoufood)
  - [Table des matières](#table-des-matières)
  - [Présentation](#présentation)
    - [Contenu](#contenu)
  - [Manuel de l'utilisateur](#manuel-de-lutilisateur)

## Présentation

Projet de programmation d'une application mobile et web de livraison de repas. Projet réalisé dans le cadre du cours "IFT717 Applications Internet et Mobilité" du programme de Maîtrise en informatique de l'Université de Sherbrooke.

### Contenu

Cette application permet à des utilisateurs de se faire livrer des repas à domicile par un livreur chargé de transporter le repas depuis un restaurant choisi. L'application permet la visualisation des différents menus proposés par les restaurants, le placement de commandes, la réception de notifications liées aux commandes ainsi que la mise à disposition de données dans le cadre du web sémantique.

L'application est composée de plusieurs parties chacunes développées avec des langages différents :

- [foufoufood_serveur](./foufoufood_serveur/) : Le serveur de l'application lié au différents clients permettant de manipuler les données et de fournir les différentes fonctionnalités de l'application via une API REST. Ce serveur est lié à une base de données MongoDB stockée dans le cloud MongoDB Atlas. Cette partie a été developpée avec JavaScript et utilise Node\.js, Express\.js, Mongoose et Socket\.io.
- [foufoufood_client_android](./foufoufood_client_android/) : Le client mobile Android de l'application lié au serveur permettant le choix et le placement d'une commande. Cette partie a été développée avec Kotlin et utilise Jetpack Compose.
- [foufoufood_client_ajax](./foufoufood_client_ajax/) : Le client web de l'application lié au serveur permettant le choix et le placement d'une commande. Ce client permet aussi la réception de notifications d'un utilisateur. Cette partie a été développée avec HTML, CSS et JavaScript et utilise Bootstrap.
- [foufoufood_client_semantique](./foufoufood_client_semantique/) : Le client web sémantique permettant de visualiser les différentes données fournies au format HTML par le serveur, il est aussi possible d'interroger le serveur afin d'obtenir les données au format RDF. Cette partie a été développée avec HTML, CSS et JavaScript.

## Manuel de l'utilisateur

Les documentations associées aux différentes parties sont visibles dans les fichiers README dans chaque répertoire :

- Serveur API : [Documentation](./foufoufood_serveur/README.md)
- Client Android : [Documentation](./foufoufood_client_android/README.md)
- Client Web : [Documentation](./foufoufood_client_ajax/README.md)
- Client Web sémantique : [Documentation](./foufoufood_client_semantique/README.md)

Le projet est configuré par défaut pour que toutes les parties fonctionnent sur une même machine. Cependant, les différentes parties du projet peuvent être déployées sur différents terminaux sous réserve de potentielles adaptations nécessaires dans le code (ex : adresse IP du serveur dans le client Android).
