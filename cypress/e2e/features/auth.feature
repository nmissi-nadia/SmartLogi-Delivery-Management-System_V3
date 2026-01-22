Feature: Authentification utilisateur
  En tant qu'utilisateur de SmartLogi
  Je veux pouvoir me connecter et me déconnecter
  Afin d'accéder aux fonctionnalités de l'application

  Background:
    Given l'application est lancée

  Scenario: Login réussi en tant que gestionnaire
    Given je suis sur la page de login
    When je saisis "gestionnaire" comme nom d'utilisateur
    And je saisis "password123" comme mot de passe
    And je clique sur le bouton de connexion
    Then je devrais être redirigé vers "/gestionnaire/dashboard"
    And je devrais voir le tableau de bord du gestionnaire

  Scenario: Login réussi en tant que client
    Given je suis sur la page de login
    When je saisis "client" comme nom d'utilisateur
    And je saisis "password123" comme mot de passe
    And je clique sur le bouton de connexion
    Then je devrais être redirigé vers "/client/mes-colis"
    And je devrais voir mes colis

  Scenario: Login avec identifiants incorrects
    Given je suis sur la page de login
    When je saisis "wronguser" comme nom d'utilisateur
    And je saisis "wrongpassword" comme mot de passe
    And je clique sur le bouton de connexion
    Then je devrais voir un message d'erreur "Identifiants incorrects"
    And je devrais rester sur la page de login

  Scenario: Logout et redirection
    Given je suis connecté en tant que "gestionnaire"
    And je suis sur le tableau de bord
    When je clique sur le bouton de déconnexion
    Then je devrais être redirigé vers "/auth/login"
    And je ne devrais plus être authentifié

  Scenario: Accès refusé sans authentification
    Given je ne suis pas connecté
    When j'essaie d'accéder à "/gestionnaire/dashboard"
    Then je devrais être redirigé vers "/auth/login"
    And l'URL de retour devrait être préservée
