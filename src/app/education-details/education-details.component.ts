import { Component, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-education-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './education-details.component.html',
  styleUrl: './education-details.component.css'
})
export class EducationDetailsComponent {
  @Input() formArray !: FormArray
  @Output() removeEducation = new EventEmitter<number>();
 

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  createEducation(): FormGroup {
    return this.fb.group({
      collegeName: ['', Validators.required],
      degree: ['', Validators.required],
      major: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      gpa: ['', Validators.required]
    });
  }

  onAddEducation() {
    this.formArray.push(this.createEducation());
    this.cdr.detectChanges();
  }

  onRemoveEduaction(index: number) {
    this.removeEducation.emit(index);
    this.cdr.detectChanges();
  }


}
