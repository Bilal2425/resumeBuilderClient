import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills-achievements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './skills-achievements.component.html',
  styleUrl: './skills-achievements.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsAchievementsComponent {
  skillsForm = input.required<FormGroup>();
  formArray = input.required<FormArray>();
  addSkill = output<void>();
  removeSkill = output<number>();

  onAddSkill() { this.addSkill.emit(); }
  onRemoveSkill(index: number) { this.removeSkill.emit(index); }

  readonly levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  getLevelBadgeClass(level: string): string {
    const map: Record<string, string> = {
      'Beginner': 'bg-info-subtle text-info',
      'Intermediate': 'bg-warning-subtle text-warning',
      'Advanced': 'bg-primary-subtle text-primary',
      'Expert': 'bg-success-subtle text-success',
    };
    return map[level] ?? 'bg-secondary-subtle text-secondary';
  }
}