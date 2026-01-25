import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule } from '@angular/forms';

/**
 * Composant de sélection de date réutilisable compatible avec Reactive Forms
 */
@Component({
    selector: 'app-date-picker',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ],
    template: `
    <div class="date-picker-container">
      <label *ngIf="label" [for]="id">{{ label }}</label>
      <input
        type="date"
        [id]="id"
        [value]="value"
        [min]="minDate"
        [max]="maxDate"
        [disabled]="disabled"
        (input)="onInput($event)"
        (blur)="onBlur()"
        class="date-input"
        [class.invalid]="isInvalid"
      />
    </div>
  `,
    styles: [`
    .date-picker-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }
    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #94a3b8;
    }
    .date-input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 0.75rem;
      color: white;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .date-input:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }
    .date-input.invalid {
      border-color: #ef4444;
    }
    .date-input::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
  `]
})
export class DatePickerComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() id: string = 'date-picker-' + Math.random().toString(36).substr(2, 9);
    @Input() minDate: string = '';
    @Input() maxDate: string = '';
    @Input() isInvalid: boolean = false;

    value: string = '';
    disabled: boolean = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: any): void {
        this.value = event.target.value;
        this.onChange(this.value);
    }

    onBlur(): void {
        this.onTouched();
    }
}
