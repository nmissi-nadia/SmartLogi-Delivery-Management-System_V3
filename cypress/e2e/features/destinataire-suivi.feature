# language: fr

Fonctionnalité: Suivi de colis pour destinataire
  En tant que destinataire
  Je veux suivre mon colis
  Afin de connaître son statut et sa localisation

  Scénario: Suivre un colis avec nom et email
    Étant donné que je suis sur la page de suivi rapide
    Quand je saisis mon nom "Dupont"
    Et je saisis mon email "dupont@example.com"
    Et je clique sur "Suivre mon colis"
    Alors je devrais voir les informations de mon colis
    Et je devrais voir le statut actuel
    Et je devrais voir la date de livraison estimée

  Scénario: Voir l'historique complet du colis
    Étant donné que j'ai trouvé mon colis
    Quand je clique sur "Voir l'historique"
    Alors je devrais voir toutes les étapes du colis
    Et chaque étape devrait avoir une date et heure
    Et chaque étape devrait avoir un commentaire

  Scénario: Confirmer la réception du colis
    Étant donné que mon colis est marqué comme "Livré"
    Et que je suis sur la page de détails du colis
    Quand je clique sur "Confirmer la réception"
    Et je saisis mon code de confirmation
    Alors la réception devrait être confirmée
    Et je devrais voir un message de remerciement
    Et le statut devrait passer à "RECEPTIONNE"

  Scénario: Colis introuvable
    Étant donné que je suis sur la page de suivi rapide
    Quand je saisis un nom inexistant "Inconnu"
    Et je saisis un email inexistant "inconnu@test.com"
    Et je clique sur "Suivre mon colis"
    Alors je devrais voir un message "Aucun colis trouvé"
    Et je devrais voir des suggestions de vérification

  Scénario: Suivre plusieurs colis
    Étant donné que j'ai plusieurs colis en attente
    Quand je saisis mon nom et email
    Et je clique sur "Suivre mon colis"
    Alors je devrais voir la liste de tous mes colis
    Et je devrais pouvoir filtrer par statut
    Et je devrais pouvoir trier par date
