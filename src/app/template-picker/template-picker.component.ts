import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  accent: string;
}

@Component({
  selector: 'app-template-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-picker.component.html',
  styleUrl: './template-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatePickerComponent {
  selectedTemplateId = input<string>('classic');
  templateSelect = output<string>();
  close = output<void>();

  readonly templates: TemplateOption[] = [
    {
      id: 'classic',
      name: 'Classic Professional',
      description: 'Traditional single-column, ATS-optimized',
      accent: '#4f46e5'
    },
    {
      id: 'modern',
      name: 'Modern Minimal',
      description: 'Clean design with accent bar, contemporary feel',
      accent: '#7c3aed'
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Two-column layout for senior professionals',
      accent: '#0f172a'
    },
    {
      id: 'tech',
      name: 'Tech Focused',
      description: 'Developer-style with skill tags and dark header',
      accent: '#10b981'
    }
  ];

  selectTemplate(id: string) {
    this.templateSelect.emit(id);
    this.close.emit();
  }
}
