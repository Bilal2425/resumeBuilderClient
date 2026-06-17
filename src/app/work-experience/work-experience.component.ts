import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.css'
})
export class WorkExperienceComponent {
  @Input() formArray!: FormArray;
  // @Output() addWorkExperience = new EventEmitter<void>();
  @Output() removeWorkExperience = new EventEmitter<number>();

  constructor( private cdr: ChangeDetectorRef) {}

  // createWorkExperience(): FormGroup {
  //   return this.fb.group({
  //     companyName: ['', Validators.required],
  //     position: ['', Validators.required],
  //     startDate: ['', Validators.required],
  //     endDate: ['', Validators.required],
  //     location: ['', Validators.required],
  //     description: ['', Validators.required]
  //   });
  // }

  // onAddWorkExperience() {
  //   //this.formArray.push(this.createWorkExperience());
  //   this.addWorkExperience.emit();
  //   this.cdr.detectChanges();
    
  // }

  onRemoveWorkExperience(index: number) {
    this.formArray.removeAt(index);
    console.log("Removed index:", index, "Current array:", this.formArray.controls)
    this.cdr.detectChanges();
  }

  trackByFn(index: number, item: any): number {
    return index;
  }


}
