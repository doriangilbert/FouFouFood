## Serveur de simulation de l'application FouFouFood 

### Exécution

```shell
npm install
npm run start
```

### Modèle objet (partiel) pour la plateforme de livraison de repas FoufFouFood

#### 1. **Restaurant**
* `id`: Identifiant unique du restaurant
* `name`: Nom du restaurant
* `address`: Adresse du restaurant
* `cuisine`: Type de cuisine (e.g., camerounaise, québécoise, indienne)
* `phone`: Numéro de téléphone
* `opening_hours`: Heures d'ouverture
* `menu`: Tableau d'objets représentant les plats (voir classe "MenuItems")
* `rating`: Note moyenne du restaurant
* `reviews`: Tableau d'objets représentant les avis des clients

#### 2. **MenuItem**
* `id`: Identifiant unique du plat
* `name`: Nom du plat
* `description`: Description du plat
* `price`: Prix du plat
* `category`: Catégorie du plat (e.g., entrée, plat principal, dessert)
* `image`: URL de l'image du plat
* `restaurant_id`: Référence à l'identifiant du restaurant auquel le plat appartient

#### 3. **User**
* `id`: Identifiant unique de l'utilisateur
* `name`: Nom de l'utilisateur
* `email`: Adresse email
* `password`: Mot de passe haché
* `phone`: Numéro de téléphone
* `address`: Adresse de livraison
* `is_admin`: Booléen indiquant si l'utilisateur est un administrateur
* `orders`: Tableau d'objets représentant les commandes passées par l'utilisateur

#### 4. **Order**
* `id`: Identifiant unique de la commande
* `user_id`: Référence à l'identifiant de l'utilisateur ayant passé la commande
* `restaurant_id`: Référence à l'identifiant du restaurant
* `items`: Tableau d'objets représentant les plats commandés (quantité, prix unitaire)
* `total_price`: Prix total de la commande
* `status`: État de la commande (en cours, préparée, en livraison, livrée, annulée)
* `delivery_address`: Adresse de livraison
* `delivery_partner`: Référence à l'identifiant du partenaire de livraison (si applicable)
* `created_at`: Date et heure de création de la commande
* `updated_at`: Date et heure de la dernière mise à jour de la commande

#### 5. **DeliveryPartner**
* `id`: Identifiant unique du partenaire de livraison
* `name`: Nom du partenaire
* `vehicle`: Véhicule utilisé
* `location`: Coordonnées GPS actuelles
* `status`: Statut du partenaire (disponible, occupé)

### Notes :

Ce schéma de base permet de démontrer quelques fonctionalités. Il doit être adapté et étendu en fonction des besoins spécifiques de toutes les fonctionnalités de l'application.

On pourra entre autres intégrer:

* **Les deux types d'administrateurs:** Pour gérer les administrateurs, il faut distinguer les administrateurs de toute la plateforme, et les administrateurs des restaurants.
* **La geolocalisation:** Pour gérer la localisation des restaurants, des partenaires de livraison et les adresses de livraison. On pourra utiliser des modules Node.js spécialisés comme GeoJSON.
* **Les paiements:** Les informations de paiement peuvent être stockées dans une classe séparée ou dans la classe "Order".
* **Les notifications:** Les informations nécessaires pour envoyer des notifications (e.g., token de l'appareil) peuvent être stockées dans une classe séparée ou la classe "User".

Etc.


