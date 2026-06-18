import { PersonalDetails } from './personal-details.model';
import { WorkExperience } from './work-experience';
import { Education } from './education';

export interface Resume {
    id?: string;
    personalDetails: PersonalDetails;
    workExperiences: WorkExperience[];
    educations: Education[];
}