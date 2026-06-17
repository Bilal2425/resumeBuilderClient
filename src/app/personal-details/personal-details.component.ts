import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDetails } from '../models/personal-details.model';
import { PersonalDetailsService } from '../services/personal-details.service';
import { error } from 'console';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css'
})
export class PersonalDetailsComponent {


  @Input() personalDetailsForm!: FormGroup;
  @Output() nextSection = new EventEmitter<void>();
  

  constructor(private personalDetailsService: PersonalDetailsService) { }



  // Method to get the form value as a PersonDetails object
  getPersonalDetailsValue(): PersonalDetails {
    return this.personalDetailsForm.value as PersonalDetails;
  }


  onSubmit(){

    if(this.personalDetailsForm.valid)
    {
      const personalDetails: PersonalDetails = this.getPersonalDetailsValue();

      this.personalDetailsService.savePersonalDetails(personalDetails).subscribe(

        (response: any) => {
          console.log('Personal Details saved successfully:', response);
          //Emit the event to notify parent component
          this.nextSection.emit();
        },
        (error: any) => {
          console.error('Error saving personal details:', error)
        }
      );

      //saving to local storage
      localStorage.setItem('personalDetails', JSON.stringify(personalDetails));
      console.log('Personal Details saved to local storage:', personalDetails);

      
     

    }
    else
    {
      console.log('Form is not valid');
    }
  }
  

}
