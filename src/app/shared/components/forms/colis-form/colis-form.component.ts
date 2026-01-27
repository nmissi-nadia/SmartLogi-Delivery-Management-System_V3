import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../../validators/custom-validators';
import { FormErrorService } from '../../../services/form-error.service';
import { InputErrorComponent } from '../input-error/input-error.component';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { Colis, ColisRequestDTO } from '../../../../core/services/colis.service';
import { ZoneService, Zone } from '../../../../core/services/zone.service';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Formulaire complexe pour la création et modification de colis
 * Gère les informations du colis, de l'expéditeur, du destinataire et les produits
 */
@Component({
    selector: 'app-colis-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputErrorComponent,
        AutocompleteComponent
    ],
    templateUrl: './colis-form.component.html',
    styleUrl: './colis-form.component.css'
})
export class ColisFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly zoneService = inject(ZoneService);
    public readonly errorService = inject(FormErrorService);

    @Input() initialData: Colis | null = null;
    @Output() formSubmit = new EventEmitter<ColisRequestDTO>();
    @Output() formCancel = new EventEmitter<void>();

    colisForm!: FormGroup;
    zones$: Observable<Zone[]> = of([]);
    filteredZones: Zone[] = [];

    constructor() {
        this.initForm();
    }

    ngOnInit(): void {
        this.loadZones();
        if (this.initialData) {
            this.patchForm(this.initialData);
        }
    }

    private initForm(): void {
        this.colisForm = this.fb.group({
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
            poids: [null, [Validators.required, CustomValidators.weightRange(0.1, 1000)]],
            priorite: ['MOYENNE', [Validators.required]],
            villeDestination: ['', [Validators.required]],

            // Groupe Expéditeur
            clientExpediteur: this.fb.group({
                nom: ['', [Validators.required]],
                prenom: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                telephone: ['', [Validators.required, CustomValidators.phoneNumber]],
                adresse: ['', [Validators.required]]
            }),

            // Groupe Destinataire
            destinataire: this.fb.group({
                nom: ['', [Validators.required]],
                prenom: ['', [Validators.required]],
                email: ['', [Validators.required, Validators.email]],
                telephone: ['', [Validators.required, CustomValidators.phoneNumber]],
                adresse: ['', [Validators.required]]
            }),

            // Zone (Optionnel)
            zoneId: [null],

            // Liste de produits (FormArray)
            produits: this.fb.array([])
        });

        // Ajouter un produit par défaut si création
        if (!this.initialData) {
            this.addProduit();
        }
    }

    get produits(): FormArray {
        return this.colisForm.get('produits') as FormArray;
    }

    addProduit(): void {
        const produitGroup = this.fb.group({
            nom: ['', [Validators.required]],
            categorie: ['', [Validators.required]],
            poids: [null, [Validators.required, Validators.min(0.1)]],
            prix: [null, [Validators.required, Validators.min(0)]],
            quantite: [1, [Validators.required, Validators.min(1)]]
        });
        this.produits.push(produitGroup);
    }

    removeProduit(index: number): void {
        if (this.produits.length > 1) {
            this.produits.removeAt(index);
        }
    }

    private loadZones(): void {
        this.zones$ = this.zoneService.getZones();
    }

    onZoneSearch(term: string): void {
        this.zoneService.getZones().pipe(
            map(zones => zones.filter(z =>
                z.nom.toLowerCase().includes(term.toLowerCase()) ||
                z.codePostal.includes(term)
            ))
        ).subscribe(filtered => this.filteredZones = filtered);
    }

    private patchForm(data: Colis): void {
        this.colisForm.patchValue({
            description: data.description,
            poids: data.poids,
            priorite: data.priorite,
            villeDestination: data.villeDestination,
            zoneId: data.zoneId
        });

        // Note: Dans un cas réel, il faudrait aussi charger les détails de l'expéditeur/destinataire s'ils ne sont pas dans l'objet Colis
    }

    onSubmit(): void {
        if (this.colisForm.valid) {
            const formValue = this.colisForm.value;

            // Transformation des produits pour correspondre au DTO
            const productsDTO = formValue.produits.map((p: any) => ({
                produit: {
                    nom: p.nom,
                    categorie: p.categorie,
                    poids: p.poids,
                    prix: p.prix
                },
                quantite: p.quantite
            }));

            const requestDTO: ColisRequestDTO = {
                description: formValue.description,
                poids: formValue.poids,
                priorite: formValue.priorite,
                villeDestination: formValue.villeDestination,
                clientExpediteur: formValue.clientExpediteur,
                destinataire: formValue.destinataire,
                produits: productsDTO
            };

            if (formValue.zoneId) {
                // Idéalement on passerait l'objet Zone complet si le DTO l'exige
                requestDTO.zone = { id: formValue.zoneId, nom: '', codePostal: '' };
            }

            this.formSubmit.emit(requestDTO);
        } else {
            this.markFormGroupTouched(this.colisForm);
        }
    }

    onCancel(): void {
        this.formCancel.emit();
    }

    private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
        Object.values(formGroup.controls).forEach(control => {
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            } else {
                control.markAsTouched();
            }
        });
    }
}
