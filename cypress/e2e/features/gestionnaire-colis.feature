Feature: Gestion des colis par le gestionnaire
  En tant que gestionnaire
  Je veux pouvoir gérer les colis
  Afin d'assurer le bon fonctionnement des livraisons

  Background:
    Given je suis connecté en tant que "gestionnaire"

  Scenario: Consultation du dashboard
    Given je suis sur le tableau de bord
    Then je devrais voir les statistiques des colis
    And je devrais voir le nombre total de colis
    And je devrais voir les colis par statut

  Scenario: Création d'un nouveau colis
    Given je suis sur la page de gestion des colis
    When je clique sur "Nouveau colis"
    And je remplis le formulaire de colis avec:
      | champ              | valeur                |
      | description        | Colis de test E2E     |
      | poids              | 5.5                   |
      | priorité           | HAUTE                 |
      | villeDestination   | Paris                 |
    And je remplis les informations du destinataire
    And je clique sur "Créer"
    Then le colis devrait être créé avec succès
    And je devrais voir le nouveau colis dans la liste

  Scenario: Assignation d'un livreur à un colis
    Given il existe un colis non assigné
    And je suis sur la page de détails du colis
    When je clique sur "Assigner un livreur"
    And je sélectionne un livreur disponible
    And je confirme l'assignation
    Then le livreur devrait être assigné au colis
    And le statut du colis devrait être mis à jour

  Scenario: Modification du statut d'un colis
    Given il existe un colis en cours
    And je suis sur la page de détails du colis
    When je change le statut à "EN_TRANSIT"
    And j'ajoute un commentaire "Colis en route"
    And je confirme la modification
    Then le statut devrait être mis à jour
    And l'historique devrait contenir la modification

  Scenario: Filtrage des colis par statut
    Given je suis sur la page de gestion des colis
    When je sélectionne le filtre "EN_TRANSIT"
    Then je devrais voir uniquement les colis en transit
    And le compteur devrait afficher le bon nombre

  Scenario: Recherche de colis
    Given je suis sur la page de gestion des colis
    When je saisis "COL-001" dans la barre de recherche
    Then je devrais voir uniquement le colis "COL-001"
