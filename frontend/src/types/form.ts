export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface FormData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  
  // Step 2: Contact Information
  phone: string;
  address: string;
  
  // Step 3: Professional Background
  occupation: string;
  yearsOfExperience: string;
  
  // Step 4: Education
  education: string;
  degree: string;
  
  // Step 5: Skills
  skills: string[];
  
  // Step 6: Preferences
  preferredWorkLocation: string;
  expectedSalary: string;
  
  // Step 7: Additional Information
  additionalInfo: string;
} 