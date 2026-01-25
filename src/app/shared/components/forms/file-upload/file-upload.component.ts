import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * Composant d'upload de fichier réutilisable compatible avec Reactive Forms
 */
@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileUploadComponent),
            multi: true
        }
    ],
    template: `
    <div class="file-upload-container">
      <label *ngIf="label" [for]="id">{{ label }}</label>
      <div 
        class="drop-zone" 
        [class.dragging]="dragging"
        [class.disabled]="disabled"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <div class="drop-zone-content" *ngIf="!fileName">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="upload-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p>Cliquez ou glissez un fichier ici</p>
          <span class="file-hint">Max {{ maxSize }} Mo</span>
        </div>
        
        <div class="file-info" *ngIf="fileName">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="file-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span class="file-name">{{ fileName }}</span>
          <button type="button" class="remove-btn" (click)="removeFile($event)">Supprimer</button>
        </div>
      </div>
      <input
        #fileInput
        type="file"
        [id]="id"
        [accept]="accept"
        [disabled]="disabled"
        (change)="onFileSelected($event)"
        style="display: none"
      />
    </div>
  `,
    styles: [`
    .file-upload-container {
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
    .drop-zone {
      border: 2px dashed rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.02);
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .drop-zone:hover {
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.05);
    }
    .drop-zone.dragging {
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      transform: scale(1.02);
    }
    .drop-zone.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .drop-zone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .upload-icon {
      width: 2.5rem;
      height: 2.5rem;
      color: #94a3b8;
    }
    p {
      margin: 0;
      color: #e2e8f0;
      font-size: 0.875rem;
    }
    .file-hint {
      color: #64748b;
      font-size: 0.75rem;
    }
    .file-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      background: rgba(56, 189, 248, 0.1);
      padding: 1rem;
      border-radius: 0.5rem;
    }
    .file-icon {
      width: 1.5rem;
      height: 1.5rem;
      color: #38bdf8;
    }
    .file-name {
      color: #e2e8f0;
      font-size: 0.875rem;
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .remove-btn {
      background: none;
      border: none;
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
    .remove-btn:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  `]
})
export class FileUploadComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() id: string = 'file-upload-' + Math.random().toString(36).substr(2, 9);
    @Input() accept: string = '*/*';
    @Input() maxSize: number = 5; // Mo

    fileName: string | null = null;
    dragging: boolean = false;
    disabled: boolean = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    writeValue(value: any): void {
        if (value instanceof File) {
            this.fileName = value.name;
        } else {
            this.fileName = null;
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
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (!this.disabled) this.dragging = true;
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.dragging = false;
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.dragging = false;

        if (this.disabled) return;

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    onFileSelected(event: any): void {
        const files = event.target.files;
        if (files && files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    removeFile(event: MouseEvent): void {
        event.stopPropagation();
        this.fileName = null;
        this.onChange(null);
    }

    private handleFile(file: File): void {
        const fileSizeInMo = file.size / (1024 * 1024);
        if (fileSizeInMo > this.maxSize) {
            alert(`Le fichier est trop volumineux. Max ${this.maxSize} Mo.`);
            return;
        }

        this.fileName = file.name;
        this.onChange(file);
        this.onTouched();
    }
}
