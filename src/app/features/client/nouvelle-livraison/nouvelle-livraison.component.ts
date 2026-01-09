import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import {
    ProduitService,
    DestinataireService,
    ZoneService,
    ColisService
} from '../../../core/services';
import type { Produit } from '../../../core/services/produit.service';
import type { Destinataire } from '../../../core/services/destinataire.service';
import type { Zone } from '../../../core/services/zone.service';
import type { ColisRequestDTO } from '../../../core/services/colis.service';

/**
 * Composant pour créer une nouvelle demande de livraison
 * Connecté au backend API
 */
@Component({
    selector: 'app-nouvelle-livraison',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
    templateUrl: './nouvelle-livraison.component.html',
    styleUrl: './nouvelle-livraison.component.css'
})
export class NouvelleLivraisonComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly produitService = inject(ProduitService);
    private readonly destinataireService = inject(DestinataireService);
    private readonly zoneService = inject(ZoneService);
    private readonly colisService = inject(ColisService);

    livraisonForm: FormGroup;
    loading = signal(false);
    loadingData = signal(true);
    successMessage = signal<string | null>(null);
    errorMessage = signal<string | null>(null);

    // Listes chargées depuis l'API
    produitsDisponibles = signal<Produit[]>([]);
    destinatairesDisponibles = signal<Destinataire[]>([]);
    zonesDisponibles = signal<Zone[]>([]);

    constructor() {
        this.livraisonForm = this.fb.group({
            description: ['', [Validators.required, Validators.minLength(5)]],
            poids: ['', [Validators.required, Validators.min(0.1)]],
            priorite: ['MOYENNE', Validators.required],
            villeDestination: ['', [Validators.required, Validators.minLength(2)]],
            produits: this.fb.array([], Validators.required),
            // Destinataire
            destinataireType: ['existant', Validators.required],
            destinataireId: [''],
            destinataireNom: [''],
            destinatairePrenom: [''],
            destinataireEmail: [''],
            destinataireTelephone: [''],
            destinataireAdresse: [''],
            // Zone
            zoneType: ['existant'],
            zoneId: [''],
            zoneNom: [''],
            zoneCodePostal: ['']
        });

        this.ajouterProduit();
        this.onDestinataireTypeChange();
        this.onZoneTypeChange();
    }

    ngOnInit(): void {
        this.chargerDonnees();
    }

    /**
     * Charge les données depuis l'API
     */
    private chargerDonnees(): void {
        this.loadingData.set(true);

        // Charger les produits
        this.produitService.getProduits().subscribe({
            next: (produits) => {
                this.produitsDisponibles.set(produits);
            },
            error: (error) => {
                console.error('Erreur chargement produits:', error);
                this.errorMessage.set('Erreur lors du chargement des produits');
            }
        });

        // Charger les destinataires
        this.destinataireService.getDestinataires().subscribe({
            next: (destinataires) => {
                this.destinatairesDisponibles.set(destinataires);
            },
            error: (error) => {
                console.error('Erreur chargement destinataires:', error);
            }
        });

        // Charger les zones
        this.zoneService.getZones().subscribe({
            next: (zones) => {
                this.zonesDisponibles.set(zones);
                this.loadingData.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement zones:', error);
                this.loadingData.set(false);
            }
        });
    }

    get produits(): FormArray {
        return this.livraisonForm.get('produits') as FormArray;
    }

    creerProduitFormGroup(): FormGroup {
        return this.fb.group({
            type: ['existant', Validators.required],
            produitId: [''],
            quantite: [1, [Validators.required, Validators.min(1)]],
            nom: [''],
            categorie: [''],
            poids: [''],
            prix: ['']
        });
    }

    ajouterProduit(): void {
        this.produits.push(this.creerProduitFormGroup());
    }

    supprimerProduit(index: number): void {
        if (this.produits.length > 1) {
            this.produits.removeAt(index);
        }
    }

    onProduitTypeChange(index: number): void {
        const produitGroup = this.produits.at(index) as FormGroup;
        const type = produitGroup.get('type')?.value;

        if (type === 'existant') {
            produitGroup.get('produitId')?.setValidators([Validators.required]);
            produitGroup.get('nom')?.clearValidators();
            produitGroup.get('categorie')?.clearValidators();
            produitGroup.get('poids')?.clearValidators();
            produitGroup.get('prix')?.clearValidators();
        } else {
            produitGroup.get('produitId')?.clearValidators();
            produitGroup.get('nom')?.setValidators([Validators.required, Validators.minLength(2)]);
            produitGroup.get('categorie')?.setValidators([Validators.required]);
            produitGroup.get('poids')?.setValidators([Validators.required, Validators.min(0.01)]);
            produitGroup.get('prix')?.setValidators([Validators.required, Validators.min(0)]);
        }

        produitGroup.get('produitId')?.updateValueAndValidity();
        produitGroup.get('nom')?.updateValueAndValidity();
        produitGroup.get('categorie')?.updateValueAndValidity();
        produitGroup.get('poids')?.updateValueAndValidity();
        produitGroup.get('prix')?.updateValueAndValidity();
    }

    onDestinataireTypeChange(): void {
        const type = this.livraisonForm.get('destinataireType')?.value;

        if (type === 'existant') {
            this.livraisonForm.get('destinataireId')?.setValidators([Validators.required]);
            this.livraisonForm.get('destinataireNom')?.clearValidators();
            this.livraisonForm.get('destinatairePrenom')?.clearValidators();
            this.livraisonForm.get('destinataireEmail')?.clearValidators();
            this.livraisonForm.get('destinataireTelephone')?.clearValidators();
            this.livraisonForm.get('destinataireAdresse')?.clearValidators();
        } else {
            this.livraisonForm.get('destinataireId')?.clearValidators();
            this.livraisonForm.get('destinataireNom')?.setValidators([Validators.required, Validators.minLength(2)]);
            this.livraisonForm.get('destinatairePrenom')?.setValidators([Validators.required, Validators.minLength(2)]);
            this.livraisonForm.get('destinataireEmail')?.setValidators([Validators.required, Validators.email]);
            this.livraisonForm.get('destinataireTelephone')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{10}$/)]);
            this.livraisonForm.get('destinataireAdresse')?.setValidators([Validators.required, Validators.minLength(10)]);
        }

        this.livraisonForm.get('destinataireId')?.updateValueAndValidity();
        this.livraisonForm.get('destinataireNom')?.updateValueAndValidity();
        this.livraisonForm.get('destinatairePrenom')?.updateValueAndValidity();
        this.livraisonForm.get('destinataireEmail')?.updateValueAndValidity();
        this.livraisonForm.get('destinataireTelephone')?.updateValueAndValidity();
        this.livraisonForm.get('destinataireAdresse')?.updateValueAndValidity();
    }

    onZoneTypeChange(): void {
        const type = this.livraisonForm.get('zoneType')?.value;

        if (type === 'existant') {
            this.livraisonForm.get('zoneId')?.clearValidators();
            this.livraisonForm.get('zoneNom')?.clearValidators();
            this.livraisonForm.get('zoneCodePostal')?.clearValidators();
        } else {
            this.livraisonForm.get('zoneId')?.clearValidators();
            this.livraisonForm.get('zoneNom')?.setValidators([Validators.required, Validators.minLength(2)]);
            this.livraisonForm.get('zoneCodePostal')?.setValidators([Validators.required, Validators.pattern(/^[0-9]{5}$/)]);
        }

        this.livraisonForm.get('zoneId')?.updateValueAndValidity();
        this.livraisonForm.get('zoneNom')?.updateValueAndValidity();
        this.livraisonForm.get('zoneCodePostal')?.updateValueAndValidity();
    }

    onSubmit(): void {
        this.errorMessage.set(null);
        this.successMessage.set(null);

        if (this.livraisonForm.invalid) {
            this.markFormGroupTouched(this.livraisonForm);
            return;
        }

        this.loading.set(true);

        const formValue = this.livraisonForm.value;

        // Préparer les produits selon ColisProduitDTO
        const produits = formValue.produits.map((p: any) => {
            if (p.type === 'existant') {
                // Trouver le produit complet dans la liste
                const produitComplet = this.produitsDisponibles().find(prod => prod.id === p.produitId);
                return {
                    produit: produitComplet ? {
                        id: produitComplet.id,
                        nom: produitComplet.nom,
                        categorie: produitComplet.categorie,
                        poids: produitComplet.poids,
                        prix: produitComplet.prix
                    } : undefined,
                    quantite: parseInt(p.quantite)
                };
            } else {
                // Nouveau produit
                return {
                    produit: {
                        nom: p.nom,
                        categorie: p.categorie,
                        poids: parseFloat(p.poids),
                        prix: parseFloat(p.prix)
                    },
                    quantite: parseInt(p.quantite)
                };
            }
        });

        // Préparer le destinataire selon DestinataireDTO
        let destinataire: any;
        if (formValue.destinataireType === 'existant') {
            // Trouver le destinataire complet dans la liste
            const destComplet = this.destinatairesDisponibles().find(d => d.id === formValue.destinataireId);
            destinataire = destComplet ? {
                id: destComplet.id,
                nom: destComplet.nom,
                prenom: destComplet.prenom,
                email: destComplet.email,
                telephone: destComplet.telephone,
                adresse: destComplet.adresse
            } : undefined;
        } else {
            // Nouveau destinataire
            destinataire = {
                nom: formValue.destinataireNom,
                prenom: formValue.destinatairePrenom,
                email: formValue.destinataireEmail,
                telephone: formValue.destinataireTelephone,
                adresse: formValue.destinataireAdresse
            };
        }

        // Préparer la zone selon ZoneDTO
        let zone: any = undefined;
        if (formValue.zoneType === 'existant' && formValue.zoneId) {
            // Trouver la zone complète dans la liste
            const zoneComplete = this.zonesDisponibles().find(z => z.id === formValue.zoneId);
            zone = zoneComplete ? {
                id: zoneComplete.id,
                nom: zoneComplete.nom,
                codePostal: zoneComplete.codePostal
            } : undefined;
        } else if (formValue.zoneType === 'nouveau') {
            // Nouvelle zone
            zone = {
                nom: formValue.zoneNom,
                codePostal: formValue.zoneCodePostal
            };
        }

        // Préparer le client expéditeur (TODO: récupérer depuis le token JWT)
        const clientExpediteur = {
            id: '1' // TODO: Récupérer l'ID réel depuis le token JWT
        };

        // Préparer les données complètes selon ColisRequestDTO
        const colisData: ColisRequestDTO = {
            description: formValue.description,
            poids: parseFloat(formValue.poids),
            priorite: formValue.priorite,
            villeDestination: formValue.villeDestination,
            clientExpediteur: clientExpediteur,
            destinataire: destinataire,
            produits: produits,
            zone: zone
        };

        console.log('Données envoyées au backend:', JSON.stringify(colisData, null, 2));

        // Envoyer au backend
        this.colisService.createColis(colisData).subscribe({
            next: (response) => {
                this.loading.set(false);
                this.successMessage.set('Demande de livraison créée avec succès !');

                setTimeout(() => {
                    this.router.navigate(['/client/mes-colis']);
                }, 2000);
            },
            error: (error) => {
                this.loading.set(false);
                console.error('Erreur création colis:', error);
                this.errorMessage.set(error.error?.message || 'Erreur lors de la création de la livraison');
            }
        });
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormArray) {
                control.controls.forEach(c => {
                    if (c instanceof FormGroup) {
                        this.markFormGroupTouched(c);
                    }
                });
            }
        });
    }

    hasError(fieldName: string, errorType: string): boolean {
        const field = this.livraisonForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    hasProduitError(index: number, fieldName: string, errorType: string): boolean {
        const field = this.produits.at(index).get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    getErrorMessage(fieldName: string): string {
        const field = this.livraisonForm.get(fieldName);

        if (field?.hasError('required')) return 'Ce champ est requis';
        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength'].requiredLength;
            return `Minimum ${minLength} caractères requis`;
        }
        if (field?.hasError('min')) return 'Valeur minimale non respectée';
        if (field?.hasError('pattern')) return 'Format invalide';
        if (field?.hasError('email')) return 'Email invalide';

        return '';
    }

    getProduitType(index: number): string {
        return this.produits.at(index).get('type')?.value || 'existant';
    }

    getDestinataireType(): string {
        return this.livraisonForm.get('destinataireType')?.value || 'existant';
    }

    getZoneType(): string {
        return this.livraisonForm.get('zoneType')?.value || 'existant';
    }
}
