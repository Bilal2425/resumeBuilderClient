import { Component, ChangeDetectionStrategy, input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData } from '../../models/resume.model';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent {
  resume = input<ResumeData | null>(null);
  templateId = input<string>('classic');
  @ViewChild('resumePreview') resumePreview!: ElementRef<HTMLElement>;

  get fullName(): string {
    const p = this.resume()?.personalDetails;
    return `${p?.firstName || ''} ${p?.lastName || ''}`.trim() || 'Your Name';
  }

  get skills() {
    return this.resume()?.skills || [];
  }

  get experiences() {
    return this.resume()?.workExperiences || [];
  }

  get educations() {
    return this.resume()?.educations || [];
  }

  get certifications() {
    return this.resume()?.certifications || [];
  }

  parseMarkdown(text: string): string {
    if (!text) return '';
    let result = text;
    let boldIndex;
    let isBoldOpen = false;
    while ((boldIndex = result.indexOf('**')) !== -1) {
      if (!isBoldOpen) {
        result = result.substring(0, boldIndex) + '<strong>' + result.substring(boldIndex + 2);
        isBoldOpen = true;
      } else {
        result = result.substring(0, boldIndex) + '</strong>' + result.substring(boldIndex + 2);
        isBoldOpen = false;
      }
    }
    
    let italicIndex;
    let isItalicOpen = false;
    while ((italicIndex = result.indexOf('*')) !== -1) {
      if (!isItalicOpen) {
        result = result.substring(0, italicIndex) + '<em>' + result.substring(italicIndex + 1);
        isItalicOpen = true;
      } else {
        result = result.substring(0, italicIndex) + '</em>' + result.substring(italicIndex + 1);
        isItalicOpen = false;
      }
    }
    
    return result;
  }

  formatBullets(text: string | undefined): string {
    if (!text) return '';
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    const liItems = lines.map(line => {
      let trimmed = line.trim();
      if (trimmed.startsWith('• ')) trimmed = trimmed.substring(2).trim();
      else if (trimmed.startsWith('•')) trimmed = trimmed.substring(1).trim();
      else if (trimmed.startsWith('- ')) trimmed = trimmed.substring(2).trim();
      else if (trimmed.startsWith('* ')) trimmed = trimmed.substring(2).trim();
      
      trimmed = this.parseMarkdown(trimmed);
      return `<li>${trimmed}</li>`;
    });
    return `<ul>${liItems.join('')}</ul>`;
  }

  ensureExternalUrl(url: string | undefined): string {
    if (!url) return '';
    let trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }
    return trimmed;
  }
}
