# language: fr

Fonctionnalité: Statistiques et dashboard du gestionnaire
  En tant que gestionnaire
  Je veux consulter les statistiques
  Afin de suivre les performances du système

  Contexte:
    Étant donné que je suis connecté en tant que gestionnaire
    Et que je suis sur le dashboard

  Scénario: Voir les statistiques générales
    Alors je devrais voir le nombre total de colis
    Et je devrais voir le nombre de colis en cours
    Et je devrais voir le nombre de colis livrés
    Et je devrais voir le nombre de colis en retard
    Et je devrais voir le taux de livraison

  Scénario: Filtrer les statistiques par période
    Quand je sélectionne la période "Cette semaine"
    Alors les statistiques devraient être mises à jour
    Et je devrais voir les données de la semaine en cours
    Quand je sélectionne la période "Ce mois"
    Alors je devrais voir les données du mois en cours

  Scénario: Voir les graphiques de performance
    Alors je devrais voir un graphique des livraisons par jour
    Et je devrais voir un graphique de répartition par statut
    Et je devrais voir un graphique de performance par livreur
    Et les graphiques devraient être interactifs

  Scénario: Exporter les données
    Quand je clique sur "Exporter"
    Et je sélectionne le format "CSV"
    Alors un fichier CSV devrait être téléchargé
    Et il devrait contenir toutes les données affichées

  Scénario: Voir les statistiques par zone
    Quand je clique sur "Statistiques par zone"
    Alors je devrais voir la liste des zones
    Et chaque zone devrait afficher son nombre de colis
    Et chaque zone devrait afficher son taux de livraison

  Scénario: Voir les livreurs les plus performants
    Quand je navigue vers "Performance des livreurs"
    Alors je devrais voir le classement des livreurs
    Et chaque livreur devrait avoir son nombre de livraisons
    Et chaque livreur devrait avoir son taux de réussite
    Et je devrais pouvoir trier par différents critères

  Scénario: Voir les alertes et notifications
    Alors je devrais voir les colis en retard
    Et je devrais voir les problèmes signalés
    Et je devrais voir les notifications importantes
    Et je devrais pouvoir cliquer pour voir les détails

  Scénario: Actualiser les statistiques en temps réel
    Quand je clique sur "Actualiser"
    Alors les statistiques devraient être rechargées
    Et je devrais voir les données les plus récentes
    Et la date de dernière mise à jour devrait être affichée
