import { Component, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { WorkExperienceComponent } from '../work-experience/work-experience.component';
import { EducationDetailsComponent } from '../education-details/education-details.component';
import { SectionsComponent } from '../sections/sections.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Resume } from '../models/resume';
import { ResumeService } from '../services/resume.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PersonalDetailsComponent,
    WorkExperienceComponent,
    EducationDetailsComponent,
    SectionsComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  currentSection = signal<string>('personalDetails');
  isSaving = signal<boolean>(false);
  completionPercentage = signal<number>(0);

  constructor(private fb: FormBuilder, private resumeService: ResumeService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      personalDetails: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        location: ['', Validators.required],
      }),
      workExperiences: this.fb.array([]), 
      educationDetails: this.fb.array([]), 
    });

    const resumeData = history.state?.resume;
    if (resumeData) {
      this.populateForm(resumeData);
    }

    this.form.valueChanges.subscribe(() => {
        this.calculateProgress();
    });
    this.calculateProgress();
  }

  calculateProgress() {
    let completedSections = 0;
    let totalSections = 3; // Personal, Work, Education

    if (this.personalDetails.valid) completedSections++;
    // Consider arrays valid if they have at least one valid entry, or if empty (optional section)
    // Adjust logic if they are strictly required. Assuming at least 1 valid entry is needed for 'complete'
    if (this.workExperiences.length > 0 && this.workExperiences.valid) completedSections++;
    else if (this.workExperiences.length === 0) totalSections--; // Optional section

    if (this.educationDetails.length > 0 && this.educationDetails.valid) completedSections++;
    else if (this.educationDetails.length === 0) totalSections--;

    const percentage = totalSections === 0 ? 100 : Math.round((completedSections / totalSections) * 100);
    this.completionPercentage.set(percentage);
  }

  showSection(section: string) {
    this.currentSection.set(section);
  }

  get personalDetails(): FormGroup {
    return this.form.get('personalDetails') as FormGroup;
  }

  onPersonalDetailsSaveAndContinue() {
    this.showSection('workExperience');
  }

  createWorkExperience(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  get workExperiences(): FormArray {
    return this.form.get('workExperiences') as FormArray;
  }

  addWorkExperience() {
    this.workExperiences.push(this.createWorkExperience());
    this.calculateProgress();
  }

  removeWorkExperience(index: number) {
    this.workExperiences.removeAt(index);
    this.calculateProgress();
  }


  createEducation(): FormGroup {
    return this.fb.group({
      collegeName: ['', Validators.required],
      degree: ['', Validators.required],
      major: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      gpa: ['', Validators.required],
    });
  }

  get educationDetails(): FormArray {
    return this.form.get('educationDetails') as FormArray;
  }

  addEducation() {
    this.educationDetails.push(this.createEducation());
    this.calculateProgress();
  }

  removeEducation(index: number) {
    this.educationDetails.removeAt(index);
    this.calculateProgress();
  }

  populateForm(resumeData: Resume): void {
    if (resumeData.personalDetails) {
      this.form.get('personalDetails')?.patchValue(resumeData.personalDetails);
    }

    if (resumeData.workExperiences && resumeData.workExperiences.length > 0) {
      const workExperienceArray = this.form.get('workExperiences') as FormArray;
      resumeData.workExperiences.forEach(experience => {
        workExperienceArray.push(
          this.fb.group({
            companyName: [experience.companyName, Validators.required],
            position: [experience.position, Validators.required],
            startDate: [experience.startDate, Validators.required],
            endDate: [experience.endDate, Validators.required],
            location: [experience.location, Validators.required],
            description: [experience.description, Validators.required],
          })
        );
      });
    }

    if (resumeData.educations && resumeData.educations.length > 0) {
      const educationArray = this.form.get('educationDetails') as FormArray;
      resumeData.educations.forEach(education => {
        educationArray.push(
          this.fb.group({
            collegeName: [education.collegeName, Validators.required],
            degree: [education.degree, Validators.required],
            major: [education.major, Validators.required],
            startDate: [education.startDate, Validators.required],
            endDate: [education.endDate, Validators.required],
            location: [education.location, Validators.required],
            gpa: [education.gpa, Validators.required],
          })
        );
      });
    }
  }

  submitResume() {
    if (this.form.valid) {
      this.isSaving.set(true);
      const resumeData: Resume = this.form.value;
      
      this.resumeService.saveResume(resumeData).subscribe({
        next: (response) => {
          console.log('Resume saved successfully', response);
          this.isSaving.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error saving resume', error);
          this.isSaving.set(false);
        }
      });
    } else {
      console.log('Form is invalid', this.form.errors);
      this.form.markAllAsTouched();
    }
  }
}
