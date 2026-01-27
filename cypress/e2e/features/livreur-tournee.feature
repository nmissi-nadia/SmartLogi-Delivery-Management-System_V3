# language: fr

Fonctionnalité: Gestion de la tournée du livreur
  En tant que livreur
  Je veux gérer ma tournée quotidienne
  Afin de livrer efficacement mes colis

  Contexte:
    Étant donné que je suis connecté en tant que livreur

  Scénario: Voir ma tournée du jour
    Quand je navigue vers la page "Mes Colis"
    Alors je devrais voir la liste de mes colis à livrer
    Et les colis devraient être triés par priorité

  Scénario: Mettre à jour le statut d'un colis en "En cours de livraison"
    Étant donné que j'ai des colis dans ma tournée
    Quand je clique sur un colis
    Et je change le statut à "EN_COURS_DE_LIVRAISON"
    Et je clique sur "Enregistrer"
    Alors le statut du colis devrait être mis à jour
    Et je devrais voir un message de confirmation

  Scénario: Marquer un colis comme livré
    Étant donné que j'ai un colis en cours de livraison
    Quand je clique sur le colis
    Et je change le statut à "LIVRE"
    Et je saisis la signature du destinataire
    Et je clique sur "Confirmer la livraison"
    Alors le colis devrait être marqué comme livré
    Et il devrait disparaître de ma liste de colis actifs

  Scénario: Signaler un problème de livraison
    Étant donné que j'ai un colis à livrer
    Quand je clique sur le colis
    Et je clique sur "Signaler un problème"
    Et je sélectionne "Destinataire absent"
    Et je saisis un commentaire "Personne au domicile, boîte aux lettres pleine"
    Et je clique sur "Enregistrer"
    Alors le problème devrait être enregistré
    Et le statut devrait passer à "PROBLEME"
    Et le gestionnaire devrait être notifié

  Scénario: Voir l'itinéraire optimisé
    Quand je navigue vers la page "Ma Tournée"
    Alors je devrais voir une carte avec mes points de livraison
    Et l'itinéraire devrait être optimisé
    Et je devrais voir le temps estimé total
