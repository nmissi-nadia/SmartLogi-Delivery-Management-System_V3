import { Component, Input, Output, EventEmitter, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Composant d'autocomplétion réutilisable
 */
@Component({
    selector: 'app-autocomplete',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AutocompleteComponent),
            multi: true
        }
    ],
    template: `
    <div class="autocomplete-container">
      <label *ngIf="label" [for]="id">{{ label }}</label>
      <div class="input-wrapper">
        <input
          [formControl]="searchControl"
          [id]="id"
          [placeholder]="placeholder"
          [disabled]="disabled"
          (blur)="onBlur()"
          (focus)="showResults = true"
          class="search-input"
          [class.invalid]="isInvalid"
          autocomplete="off"
        />
        <div *ngIf="loading" class="spinner"></div>
      </div>
      
      <ul *ngIf="showResults && options && options.length > 0" class="results-list">
        <li *ngFor="let option of options" (mousedown)="selectOption(option)">
          {{ option[displayKey] }}
        </li>
      </ul>
      
      <div *ngIf="showResults && options && options.length === 0 && searchControl.value" class="no-results">
        Aucun résultat trouvé
      </div>
    </div>
  `,
    styles: [`
    .autocomplete-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      position: relative;
    }
    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #94a3b8;
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 0.75rem;
      color: white;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-input:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }
    .search-input.invalid {
      border-color: #ef4444;
    }
    .spinner {
      position: absolute;
      right: 0.75rem;
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .results-list {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 50;
      margin: 0.25rem 0 0 0;
      padding: 0.5rem 0;
      list-style: none;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      max-height: 200px;
      overflow-y: auto;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    }
    .results-list li {
      padding: 0.75rem 1rem;
      color: #e2e8f0;
      cursor: pointer;
      transition: background 0.2s;
    }
    .results-list li:hover {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
    }
    .no-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 50;
      margin-top: 0.25rem;
      padding: 0.75rem 1rem;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      color: #94a3b8;
      font-size: 0.875rem;
      font-style: italic;
    }
  `]
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() label: string = '';
    @Input() placeholder: string = 'Rechercher...';
    @Input() id: string = 'autocomplete-' + Math.random().toString(36).substr(2, 9);
    @Input() options: any[] = [];
    @Input() displayKey: string = 'name';
    @Input() valueKey: string = 'id';
    @Input() loading: boolean = false;
    @Input() isInvalid: boolean = false;

    @Output() searchChange = new EventEmitter<string>();

    searchControl = new FormControl('');
    showResults: boolean = false;
    disabled: boolean = false;
    private selectedValue: any = null;
    private sub: Subscription = new Subscription();

    onChange: any = () => { };
    onTouched: any = () => { };

    ngOnInit() {
        this.sub = this.searchControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe(value => {
            if (this.showResults && value !== null) {
                this.searchChange.emit(value);
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    writeValue(value: any): void {
        this.selectedValue = value;
        // On ne met pas à jour le texte du champ de recherche ici pour éviter d'écraser la saisie en cours
        // sauf si value est null (reset)
        if (value === null) {
            this.searchControl.setValue('', { emitEvent: false });
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        if (isDisabled) {
            this.searchControl.disable();
        } else {
            this.searchControl.enable();
        }
    }

    selectOption(option: any): void {
        this.selectedValue = option[this.valueKey];
        this.searchControl.setValue(option[this.displayKey], { emitEvent: false });
        this.showResults = false;
        this.onChange(this.selectedValue);
    }

    onBlur(): void {
        // Timeout pour laisser le temps au click sur l'option d'être enregistré
        setTimeout(() => {
            this.showResults = false;
            this.onTouched();
        }, 200);
    }
}
