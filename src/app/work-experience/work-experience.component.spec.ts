import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkExperienceComponent } from './work-experience.component';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

describe('WorkExperienceComponent', () => {
  let component: WorkExperienceComponent;
  let fixture: ComponentFixture<WorkExperienceComponent>;
  let fg: FormGroup;
  let fgd: FormGroupDirective;

  beforeEach(async () => {
    fgd = new FormGroupDirective([], []);
    fg = new FormGroup({
      workExperiences: new FormArray([])
    });
    fgd.form = fg;

    await TestBed.configureTestingModule({
      imports: [WorkExperienceComponent, ReactiveFormsModule],
      providers: [
        { provide: ControlContainer, useValue: fgd }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkExperienceComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('workExperienceForm', fg);
    fixture.componentRef.setInput('formArray', fg.get('workExperiences') as FormArray);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
