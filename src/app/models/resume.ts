import { PersonalDetails } from './personal-details.model';
import { WorkExperience } from './work-experience';
import { Education } from './education';
import { Skill } from './skill';

export interface Resume {
    id?: string;
    personalDetails: PersonalDetails;
    workExperiences: WorkExperience[];
    educations: Education[];
    skills: Skill[];
}