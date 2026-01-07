/**
 * Énumération des rôles utilisateurs dans l'application SmartLogi
 * Ces rôles doivent correspondre exactement aux rôles définis dans le backend Spring Security
 */
export enum Role {
    GESTIONNAIRE = 'GESTIONNAIRE',
    LIVREUR = 'LIVREUR',
    CLIENT = 'CLIENT',
    DESTINATAIRE = 'DESTINATAIRE'
}
