import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-sections',
  standalone: true,
  imports: [],
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.css'
})
export class SectionsComponent {
  @Output() sectionChange = new EventEmitter<string>();

  navigate(section: string){
    this.sectionChange.emit(section);
  }

}
