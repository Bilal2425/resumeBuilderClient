import { Component, OnInit } from '@angular/core';
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
import { PersonalDetails } from '../models/personal-details.model';
import { first } from 'rxjs';
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
})
export class FormComponent implements OnInit {
  form!: FormGroup;
  currentSection: string = 'personalDetails';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // this.addWorkExperience(); // Adding an empty
    this.form = this.fb.group({
      personalDetails: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        location: ['', Validators.required],
      }),
      workExperiences: this.fb.array([]), // intializing with an empty form group
      educationDetails: this.fb.array([]), // Initializing an empty form group
      sections: this.fb.group({}),
    });

    //Populating the form
    const resumeData = history.state.resume;
    if (resumeData) {
      this.populateForm(resumeData);
    }
  }

  showSection(section: string) {
    this.currentSection = section;
  }

  get personalDetails(): FormGroup {
    return this.form.get('personalDetails') as FormGroup;
  }

  onPersonalDetailsSaveAndContinue() {
    this.showSection('workExperience');
  }

  //Work Experience

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
    console.log('Before adding:', this.workExperiences.value);
    this.workExperiences.push(this.createWorkExperience());
    console.log('After adding:', this.workExperiences.value);
  }

  // (removeWorkExperience)="removeWorkExperience($event)"

  removeWorkExperience(index: number) {
    this.workExperiences.removeAt(index);
  }

  onSaveWorkExperience() {
    if (this.workExperiences.valid) {
      console.log('Work experience section saved:', this.workExperiences.value);
    } else {
      console.log('Form not valid');
    }
  }

  //Education section

  createEducation(): FormGroup {
    return this.fb.group({
      collegeName: ['', Validators.required],
      degree: ['', Validators.required],
      major: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      _gpa: ['', Validators.required],
    });
  }

  get educationDetails(): FormArray {
    return this.form.get('educationDetails') as FormArray;
  }

  addEducation() {
    this.educationDetails.push(this.createEducation());
  }

  removeEducation(index: number) {
    this.educationDetails.removeAt(index);
  }

  populateForm(resumeData: any): void {
    if (resumeData.personalDetails) {
      this.form.get('personalDetails')?.patchValue({
        firstName: resumeData.personalDetails.firstName,
        lastName: resumeData.personalDetails.lastName,
        email: resumeData.personalDetails.email,
        phoneNumber: resumeData.personalDetails.phoneNumber,
        location: resumeData.personalDetails.location,
      });
    }

    if (resumeData.workExperiences && resumeData.workExperiences.length > 0) {
      const workExperienceArray = this.form.get('workExperiences') as FormArray;
      resumeData.workExperiences.forEach((experience: any) => {
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

    // Populate education details
    if (resumeData.educations && resumeData.educations.length > 0) {
      const educationArray = this.form.get('educationDetails') as FormArray;
      resumeData.educations.forEach((education: any) => {
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
}
