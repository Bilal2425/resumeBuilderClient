import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkExperienceComponent {
  workExperienceForm = input.required<FormGroup>();
  formArray = input.required<FormArray>();
  addWorkExperience = output<void>();
  removeWorkExperience = output<number>();

  constructor() {}


  onAddWorkExperience() {
    this.addWorkExperience.emit();
  }

  onRemoveWorkExperience(index: number) {
    this.removeWorkExperience.emit(index);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
