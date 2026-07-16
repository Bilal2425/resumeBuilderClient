import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from '../services/resume.service';
import { ResumeParserService } from '../services/resume-parser.service';
import { ToastService } from '../services/toast.service';
import { ResumeData } from '../models/resume.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  resumeData: ResumeData | null = null;
  isParsing = signal<boolean>(false);
  isDragging = signal<boolean>(false);

  private router = inject(Router);
  private resumeService = inject(ResumeService);
  private parserService = inject(ResumeParserService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Attempt to load the current user's resume from the backend
    this.resumeService.getResume().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (resume) => {
        this.resumeData = resume;
      },
      error: (error) => {
        if (error.status === 404) {
          console.log('No existing resume found for this user.');
          this.resumeData = null;
        } else {
          console.error('Error fetching resume for dashboard:', error);
        }
      }
    });
  }

  buildResume() {
    this.router.navigate(['/resume-builder'], { state: { resume: this.resumeData } });
  }

  openMarkdownEditor() {
    this.router.navigate(['/markdown-editor']);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadResume(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadResume(event.dataTransfer.files[0]);
    }
  }

  private uploadResume(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      this.toastService.error('Unsupported file format. Please upload PDF or DOCX.');
      return;
    }

    this.isParsing.set(true);
    this.toastService.success('Processing resume with AI...');

    this.parserService.parseResume(file).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (parsedData) => {
        this.isParsing.set(false);
        this.toastService.success('Resume parsed successfully!');
        // Navigate to builder with the parsed resume data in route state
        this.router.navigate(['/resume-builder'], { state: { resume: parsedData } });
      },
      error: (error) => {
        this.isParsing.set(false);
        const errMsg = error.error?.error || 'AI parsing failed. Please check your file or try again.';
        this.toastService.error(errMsg);
        console.error('Parsing error:', error);
      }
    });
  }
}
