import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

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

  constructor() {}

  onAddSkill() {
    this.addSkill.emit();
  }

  onRemoveSkill(index: number) {
    this.removeSkill.emit(index);
  }
}