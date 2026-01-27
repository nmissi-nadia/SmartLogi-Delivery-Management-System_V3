Feature: Création de livraison par le client
  En tant que client
  Je veux pouvoir créer une nouvelle livraison
  Afin d'envoyer mes colis

  Background:
    Given je suis connecté en tant que "client"

  Scenario: Créer une nouvelle livraison complète
    Given je suis sur la page "Nouvelle livraison"
    When je remplis les informations du colis:
      | champ              | valeur                    |
      | description        | Livraison de documents    |
      | poids              | 2.5                       |
      | priorité           | MOYENNE                   |
      | villeDestination   | Lyon                      |
    And je remplis les informations du destinataire:
      | champ      | valeur                  |
      | nom        | Dupont                  |
      | prenom     | Marie                   |
      | email      | marie@example.com       |
      | telephone  | 0612345678              |
      | adresse    | 10 Rue de la Paix, Lyon |
    And je clique sur "Créer la livraison"
    Then la livraison devrait être créée avec succès
    And je devrais voir un message de confirmation
    And je devrais être redirigé vers "Mes colis"

  Scenario: Consulter l'historique des livraisons
    Given j'ai créé plusieurs livraisons
    When je navigue vers "Historique"
    Then je devrais voir la liste de mes livraisons passées
    And les livraisons devraient être triées par date
    And je devrais pouvoir filtrer par statut

  Scenario: Suivre un colis en cours
    Given j'ai un colis en cours de livraison
    When je clique sur le colis dans "Mes colis"
    Then je devrais voir les détails du colis
    And je devrais voir le statut actuel
    And je devrais voir l'historique des changements de statut
    And je devrais voir les informations du livreur si assigné

  Scenario: Validation des champs obligatoires
    Given je suis sur la page "Nouvelle livraison"
    When je clique sur "Créer la livraison" sans remplir les champs
    Then je devrais voir des messages d'erreur de validation
    And le formulaire ne devrait pas être soumis

  Scenario: Annulation de création de livraison
    Given je suis sur la page "Nouvelle livraison"
    And j'ai commencé à remplir le formulaire
    When je clique sur "Annuler"
    Then je devrais être redirigé vers "Mes colis"
    And les données du formulaire ne devraient pas être sauvegardées
