import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationsComponent {
  certificationsForm = input.required<FormGroup>();
  formArray = input.required<FormArray>();
  addCertification = output<void>();
  removeCertification = output<number>();

  onAddCertification() { this.addCertification.emit(); }
  onRemoveCertification(index: number) { this.removeCertification.emit(index); }
}
