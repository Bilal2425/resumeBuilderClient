import { Component, OnInit, signal, ChangeDetectionStrategy, computed, inject, DestroyRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { WorkExperienceComponent } from '../work-experience/work-experience.component';
import { EducationDetailsComponent } from '../education-details/education-details.component';
import { SkillsAchievementsComponent } from '../skills-achievements/skills-achievements.component';
import { SectionsComponent } from '../sections/sections.component';
import { PreviewComponent } from '../components/preview/preview.component';
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
import { ToastService } from '../services/toast.service';
import { ExportService } from '../services/export.service';
import { Skill } from '../models/skill';


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
    PreviewComponent,
    SkillsAchievementsComponent,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private resumeService = inject(ResumeService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private exportService = inject(ExportService);

  @ViewChild(PreviewComponent) previewComponent!: PreviewComponent;

  form!: FormGroup;
  currentSection = signal<string>('personalDetails');
  isSaving = signal<boolean>(false);
  isExporting = signal<boolean>(false);
  completionPercentage = signal<number>(0);
  resumeId = signal<string | null>(null);

  // Use a writable signal for the resume data
  resumeSignal = signal<Resume | null>(null);

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
      skills: this.fb.array([]), // Add skills FormArray
    });

    // Initialize the signal with the current form value properly mapped
    this.updateResumeSignal(this.form.value);

    // Update the signal reactively on form changes
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.updateResumeSignal(value);
      this.calculateProgress();
    });

    const resumeData = history.state?.resume;
    if (resumeData) {
      if (resumeData.id) {
        this.resumeId.set(resumeData.id);
      }
      this.populateForm(resumeData);
    }

    this.calculateProgress();
  }

  private updateResumeSignal(formValue: any) {
    const mappedResume: Resume = {
      id: this.resumeId() || undefined,
      personalDetails: formValue.personalDetails,
      workExperiences: formValue.workExperiences || [],
      educations: formValue.educationDetails || [],
      skills: formValue.skills || [] // Include skills
    };
    this.resumeSignal.set(mappedResume);
  }

  calculateProgress() {
    let completedSections = 0;
    let totalSections = 4; // Personal, Work, Education, Skills

    if (this.personalDetails.valid) completedSections++;
    if (this.workExperiences.length > 0 && this.workExperiences.valid) completedSections++;
    else if (this.workExperiences.length === 0) totalSections--;

    if (this.educationDetails.length > 0 && this.educationDetails.valid) completedSections++;
    else if (this.educationDetails.length === 0) totalSections--;

    if (this.skills.length > 0 && this.skills.valid) completedSections++;
    else if (this.skills.length === 0) totalSections--;

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

  goNext() {
    if (this.currentSection() === 'personalDetails') {
      this.showSection('workExperience');
    } else if (this.currentSection() === 'workExperience') {
      this.showSection('education');
    } else if (this.currentSection() === 'education') {
      this.showSection('skills');
    }
  }

  goBack() {
    if (this.currentSection() === 'workExperience') {
      this.showSection('personalDetails');
    } else if (this.currentSection() === 'education') {
      this.showSection('workExperience');
    } else if (this.currentSection() === 'skills') {
      this.showSection('education');
    }
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

  // New methods for Skills
  createSkill(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      level: ['', Validators.required],
    });
  }

  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.createSkill());
    this.calculateProgress();
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
    this.calculateProgress();
  }

  populateForm(resumeData: Resume): void {
    if (resumeData.personalDetails) {
      this.form.get('personalDetails')?.patchValue(resumeData.personalDetails);
    }

    const workExperienceArray = this.form.get('workExperiences') as FormArray;
    workExperienceArray.clear(); // Clear existing entries
    if (resumeData.workExperiences && resumeData.workExperiences.length > 0) {
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

    const educationArray = this.form.get('educationDetails') as FormArray;
    educationArray.clear(); // Clear existing entries
    if (resumeData.educations && resumeData.educations.length > 0) {
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

    const skillsArray = this.form.get('skills') as FormArray;
    skillsArray.clear(); // Clear existing entries
    if (resumeData.skills && resumeData.skills.length > 0) {
      resumeData.skills.forEach(skill => {
        skillsArray.push(
          this.fb.group({
            name: [skill.name, Validators.required],
            level: [skill.level, Validators.required],
          })
        );
      });
    }
  }

  submitResume() {
    if (this.form.valid) {
      this.isSaving.set(true);
      const resumeData: Resume = this.resumeSignal()!;
      
      this.resumeService.saveResume(resumeData).subscribe({
        next: (response) => {
          this.toastService.success('Resume saved successfully!');
          this.isSaving.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.toastService.error('Error saving resume. Please try again.');
          this.isSaving.set(false);
        }
      });
    } else {
      this.toastService.warning('Please complete all required fields.');
      this.form.markAllAsTouched();
    }
  }

  async downloadPdf() {
    if (this.previewComponent) {
      try {
        this.isExporting.set(true);
        const element = this.previewComponent.resumePreview.nativeElement;
        const fileName = `${this.form.value.personalDetails.firstName || 'My'}_${this.form.value.personalDetails.lastName || 'Resume'}.pdf`;
        await this.exportService.exportToPdf(element, fileName);
        this.toastService.success('Resume downloaded successfully!');
      } catch (error) {
        console.error('Export failed', error);
        this.toastService.error('Failed to export PDF. Please try again.');
      } finally {
        this.isExporting.set(false);
      }
    }
  }
}

