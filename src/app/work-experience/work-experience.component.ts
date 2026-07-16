import { Component, ChangeDetectionStrategy, input, output, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RichTextToolbarComponent } from '../components/rich-text-toolbar/rich-text-toolbar.component';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RichTextToolbarComponent],
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkExperienceComponent {
  workExperienceForm = input.required<FormGroup>();
  formArray = input.required<FormArray>();
  addWorkExperience = output<void>();
  removeWorkExperience = output<number>();

  @ViewChildren('descTextarea') descTextareas!: QueryList<ElementRef<HTMLTextAreaElement>>;

  getDescTextarea(index: number): HTMLTextAreaElement | null {
    const refs = this.descTextareas?.toArray();
    return refs?.[index]?.nativeElement ?? null;
  }

  onDescriptionChange(index: number, value: string) {
    const ctrl = this.formArray().controls[index].get('description');
    if (ctrl) {
      ctrl.setValue(value, { emitEvent: true });
      ctrl.markAsDirty();
    }
  }


  onAddWorkExperience() {
    this.addWorkExperience.emit();
  }

  onRemoveWorkExperience(index: number) {
    this.removeWorkExperience.emit(index);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
