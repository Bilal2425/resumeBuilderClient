import { Component, input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Resume } from '../../models/resume';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #resumePreview class="preview-paper modern-card shadow-xl animate-fade-in">
      <!-- Header / Personal Details -->
      <header class="preview-header mb-5 border-bottom pb-4 text-center">
        <h1 class="display-6 fw-bold text-gradient mb-1">
          {{ resume()?.personalDetails?.firstName || 'First' }} {{ resume()?.personalDetails?.lastName || 'Last' }}
        </h1>
        <div class="contact-info text-muted small d-flex justify-content-center gap-3 flex-wrap">
          @if (resume()?.personalDetails?.email) {
            <span>{{ resume()?.personalDetails?.email }}</span>
          }
          @if (resume()?.personalDetails?.phoneNumber) {
            <span>• {{ resume()?.personalDetails?.phoneNumber }}</span>
          }
          @if (resume()?.personalDetails?.location) {
            <span>• {{ resume()?.personalDetails?.location }}</span>
          }
        </div>
      </header>

      <!-- Work Experience Section -->
      <section class="mb-5">
        <h3 class="section-title text-uppercase mb-3 small fw-bold tracking-widest text-primary border-bottom border-2 border-primary-subtle pb-1">Experience</h3>
        @if (resume()?.workExperiences?.length) {
          @for (work of resume()?.workExperiences; track $index) {
            <div class="experience-item mb-4 animate-fade-in">
              <div class="d-flex justify-content-between align-items-baseline mb-1">
                <h5 class="fw-bold mb-0">{{ work.position || 'Position' }}</h5>
                <span class="text-muted small fw-medium">{{ work.startDate }} — {{ work.endDate }}</span>
              </div>
              <div class="text-primary fw-semibold small mb-2">{{ work.companyName || 'Company' }} | {{ work.location }}</div>
              <p class="small text-muted mb-0 white-space-pre">{{ work.description }}</p>
            </div>
          }
        } @else {
          <p class="text-muted small fst-italic">Add your work experience to see it here...</p>
        }
      </section>

      <!-- Education Section -->
      <section class="mb-5">
        <h3 class="section-title text-uppercase mb-3 small fw-bold tracking-widest text-primary border-bottom border-2 border-primary-subtle pb-1">Education</h3>
        @if (resume()?.educations?.length) {
          @for (edu of resume()?.educations; track $index) {
            <div class="education-item mb-4 animate-fade-in">
              <div class="d-flex justify-content-between align-items-baseline mb-1">
                <h5 class="fw-bold mb-0">{{ edu.collegeName || 'University' }}</h5>
                <span class="text-muted small fw-medium">{{ edu.startDate }} — {{ edu.endDate }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-baseline">
                <span class="text-primary fw-semibold small">{{ edu.degree || 'Degree' }} in {{ edu.major || 'Major' }}</span>
                <span class="small fw-bold text-muted">GPA: {{ edu.gpa }}</span>
              </div>
            </div>
          }
        } @else {
          <p class="text-muted small fst-italic">Add your education details to see them here...</p>
        }
      </section>

      <!-- Skills Section -->
      <section>
        <h3 class="section-title text-uppercase mb-3 small fw-bold tracking-widest text-primary border-bottom border-2 border-primary-subtle pb-1">Skills & Achievements</h3>
        @if (resume()?.skills?.length) {
            <div class="d-flex flex-wrap gap-2">
                @for (skill of resume()?.skills; track $index) {
                    <span class="badge bg-secondary-subtle text-secondary py-2 px-3 rounded-pill">{{ skill.name }} ({{ skill.level }})</span>
                }
            </div>
        } @else {
          <p class="text-muted small fst-italic">Add your skills to see them here...</p>
        }
      </section>
    </div>
  `,
  styles: `
    .preview-paper {
      background: white;
      padding: 3rem;
      min-height: 1000px;
      width: 100%;
      border-radius: var(--radius-sm);
      color: var(--text-main);
      overflow: hidden;
    }

    .section-title {
      color: var(--primary);
    }

    .white-space-pre {
      white-space: pre-line;
    }

    .experience-item, .education-item {
      page-break-inside: avoid;
    }

    h5 {
      font-size: 1.1rem;
    }
  `
})
export class PreviewComponent {
  resume = input<Resume | null>();
  @ViewChild('resumePreview') resumePreview!: ElementRef<HTMLElement>;
}
