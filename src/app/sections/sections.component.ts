import { Component, output, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [],
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionsComponent {
  currentSection = input<string>('personalDetails');
  completionPercentage = input<number>(0);
  sectionChange = output<string>();

  navigate(section: string){
    this.sectionChange.emit(section);
  }
}
