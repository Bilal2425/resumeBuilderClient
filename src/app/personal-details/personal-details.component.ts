import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDetails } from '../models/personal-details.model';
import { PersonalDetailsService } from '../services/personal-details.service';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalDetailsComponent {


  personalDetailsForm = input.required<FormGroup>();
  nextSection = output<void>();
  

  constructor(private personalDetailsService: PersonalDetailsService) { }



  // Method to get the form value as a PersonDetails object
  getPersonalDetailsValue(): PersonalDetails {
    return this.personalDetailsForm().value as PersonalDetails;
  }


  onSubmit(){

    if(this.personalDetailsForm().valid)
    {
      const personalDetails: PersonalDetails = this.getPersonalDetailsValue();

      this.personalDetailsService.savePersonalDetails(personalDetails).subscribe(

        (response: any) => {

          //Emit the event to notify parent component
          this.nextSection.emit();
        },
        (error: any) => {
          console.error('Error saving personal details:', error)
        }
      );

      //saving to local storage


      
     

    }
    else
    {

    }
  }
  

}

