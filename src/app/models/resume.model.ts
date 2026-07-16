import { PersonalDetails } from './personal-details.model';
import { Skill } from './skill.model';
import { Certification } from './certification.model';

export interface WorkExperience {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Education {
  collegeName: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
}

export interface ResumeData {
  id?: string;
  personalDetails?: PersonalDetails;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: Skill[];
  certifications?: Certification[];
  templateId?: string;
}
