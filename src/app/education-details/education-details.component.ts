import { Component, ChangeDetectionStrategy, input, output } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-education-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './education-details.component.html',
  styleUrl: './education-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EducationDetailsComponent {
  educationDetailsForm = input.required<FormGroup>();
  formArray = input.required<FormArray>();
  addEducation = output<void>();
  removeEducation = output<number>();
 

  constructor() {}


  onAddEducation() {
    this.addEducation.emit();
  }

  onRemoveEduaction(index: number) {
    this.removeEducation.emit(index);
  }

}
