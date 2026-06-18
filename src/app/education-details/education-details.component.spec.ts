import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationDetailsComponent } from './education-details.component';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

describe('EducationDetailsComponent', () => {
  let component: EducationDetailsComponent;
  let fixture: ComponentFixture<EducationDetailsComponent>;
  let fg: FormGroup;
  let fgd: FormGroupDirective;

  beforeEach(async () => {
    fgd = new FormGroupDirective([], []);
    fg = new FormGroup({
      educationDetails: new FormArray([])
    });
    fgd.form = fg;

    await TestBed.configureTestingModule({
      imports: [EducationDetailsComponent, ReactiveFormsModule],
      providers: [
        { provide: ControlContainer, useValue: fgd }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EducationDetailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('educationDetailsForm', fg);
    fixture.componentRef.setInput('formArray', fg.get('educationDetails') as FormArray);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
