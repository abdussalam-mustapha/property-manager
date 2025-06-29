import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {
  @Input() property: Property | null = null;
  @Output() closeDialog = new EventEmitter<boolean>();

  propertyForm: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService
  ) {
    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      type: ['Apartment', Validators.required],
      location: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [1, [Validators.required, Validators.min(0)]],
      bathrooms: [1, [Validators.required, Validators.min(0)]],
      area: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.property) {
      this.isEditing = true;
      this.propertyForm.patchValue(this.property);
    }
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      // In a real app, you'd show a toast notification for validation errors.
      console.error('Form is invalid');
      return;
    }

    if (this.isEditing && this.property) {
      const updatedProperty: Property = {
        ...this.property,
        ...this.propertyForm.value
      };
      this.propertyService.updateProperty(updatedProperty);
    } else {
      this.propertyService.addProperty(this.propertyForm.value);
    }

    this.closeDialog.emit(true);
  }

  close(refresh: boolean = false): void {
    this.closeDialog.emit(refresh);
  }
}
