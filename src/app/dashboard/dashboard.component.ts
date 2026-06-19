import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from '../services/resume.service';
import { Resume } from '../models/resume';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  resumeData: Resume | null = null;
  private router = inject(Router);
  private resumeService = inject(ResumeService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Attempt to load the current user's resume from the backend
    this.resumeService.getCurrentUserResume().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  buildResume(){
    this.router.navigate(['/resume-builder'], { state: { resume: this.resumeData } });
  }

}
