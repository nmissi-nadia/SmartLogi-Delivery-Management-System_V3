# language: fr

Fonctionnalité: Gestion des utilisateurs par le gestionnaire
  En tant que gestionnaire
  Je veux gérer les utilisateurs du système
  Afin de contrôler les accès et les rôles

  Contexte:
    Étant donné que je suis connecté en tant que gestionnaire
    Et que je suis sur la page "Gestion des Utilisateurs"

  Scénario: Créer un nouvel utilisateur
    Quand je clique sur "Nouvel Utilisateur"
    Et je saisis l'email "nouveau@test.com"
    Et je saisis le nom "Nouveau"
    Et je saisis le prénom "Utilisateur"
    Et je sélectionne le rôle "CLIENT"
    Et je clique sur "Créer"
    Alors l'utilisateur devrait être créé
    Et je devrais voir un message de confirmation
    Et l'utilisateur devrait apparaître dans la liste

  Scénario: Modifier un utilisateur existant
    Étant donné qu'il existe un utilisateur "test@example.com"
    Quand je clique sur l'utilisateur
    Et je clique sur "Modifier"
    Et je change le nom en "Modifié"
    Et je clique sur "Enregistrer"
    Alors les modifications devraient être sauvegardées
    Et je devrais voir le nom mis à jour dans la liste

  Scénario: Désactiver un utilisateur
    Étant donné qu'il existe un utilisateur actif
    Quand je clique sur l'utilisateur
    Et je clique sur "Désactiver"
    Et je confirme la désactivation
    Alors l'utilisateur devrait être désactivé
    Et il ne devrait plus pouvoir se connecter
    Et son statut devrait être "Inactif"

  Scénario: Réactiver un utilisateur
    Étant donné qu'il existe un utilisateur désactivé
    Quand je clique sur l'utilisateur
    Et je clique sur "Réactiver"
    Alors l'utilisateur devrait être réactivé
    Et il devrait pouvoir se connecter à nouveau

  Scénario: Changer le rôle d'un utilisateur
    Étant donné qu'il existe un utilisateur avec le rôle "CLIENT"
    Quand je clique sur l'utilisateur
    Et je clique sur "Modifier"
    Et je change le rôle à "LIVREUR"
    Et je clique sur "Enregistrer"
    Alors le rôle devrait être mis à jour
    Et l'utilisateur devrait avoir accès aux fonctionnalités livreur

  Scénario: Rechercher un utilisateur
    Étant donné qu'il existe plusieurs utilisateurs
    Quand je saisis "dupont" dans la barre de recherche
    Alors je devrais voir uniquement les utilisateurs contenant "dupont"
    Et la liste devrait être filtrée en temps réel

  Scénario: Filtrer par rôle
    Quand je sélectionne le filtre "LIVREUR"
    Alors je devrais voir uniquement les livreurs
    Et le nombre d'utilisateurs affichés devrait correspondre

  Scénario: Supprimer un utilisateur
    Étant donné qu'il existe un utilisateur sans données associées
    Quand je clique sur l'utilisateur
    Et je clique sur "Supprimer"
    Et je confirme la suppression
    Alors l'utilisateur devrait être supprimé
    Et il ne devrait plus apparaître dans la liste
