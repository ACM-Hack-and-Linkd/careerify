"use client"
import React, { useState } from 'react';
import { FormData, FormStep } from '../../types/form';
import SideBar from '@/components/sideBar';
import '../../styles/Form.css';
import { QuizResults, sendQuizResults } from '../lib/api';
import { Profile } from '../matching/page';
import { redirect } from 'next/navigation';

const steps = [
  'Personal Information',
  'Contact Information',
  'Professional Background',
  'Education',
  'Skills',
  'Preferences',
  'Additional Information'
];

const initialValues: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  occupation: '',
  yearsOfExperience: '',
  education: '',
  degree: '',
  skills: [],
  preferredWorkLocation: '',
  expectedSalary: '',
  additionalInfo: ''
};

const MultiStepFormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        break;
      case 2:
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.address) newErrors.address = 'Address is required';
        break;
      case 3:
        if (!formData.occupation) newErrors.occupation = 'Occupation is required';
        if (!formData.yearsOfExperience) {
          newErrors.yearsOfExperience = 'Years of experience is required';
        }
        break;
      case 4:
        if (!formData.education) newErrors.education = 'Education is required';
        if (!formData.degree) newErrors.degree = 'Degree is required';
        break;
      case 5:
        if (formData.skills.length === 0) {
          newErrors.skills = ['At least one skill is required'];
        }
        break;
      case 6:
        if (!formData.preferredWorkLocation) {
          newErrors.preferredWorkLocation = 'Preferred work location is required';
        }
        if (!formData.expectedSalary) {
          newErrors.expectedSalary = 'Expected salary is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => (prev - 1) as FormStep);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const results: QuizResults = {
        roles: [formData.occupation],
        companies: ["any"],
        locations: [formData.preferredWorkLocation],
        education_level: formData.education,
        experience_level: formData.yearsOfExperience + " years",
        college: formData.education,
        hobbies: [formData.additionalInfo || "any"],
        limit: 10,
      };
      console.log(results);
      sendQuizResults(results).then(json => {
        console.log(json);
        const profiles: Profile[] = json.map(v => ({
          name: v.profile.name as string || "No Name",
          email: v.profile.linkedin_url as string || "none",
          company: v.experience[0]?.company_name as string || "none",
          job_title: v.experience[0]?.title as string || "none",
          bio: v.profile.description as string || "No description",
          image_src: v.profile.profile_picture_url as string || '/images/profile_template.png',
        }));
        localStorage.setItem("profiles", JSON.stringify(profiles));
        redirect("/matching");
      });
      console.log('Form submitted:', formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newSkill = e.currentTarget.value.trim();
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      e.currentTarget.value = '';
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove)
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.firstName && <div className="form-error">{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.lastName && <div className="form-error">{errors.lastName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                rows={3}
              />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Occupation</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.occupation && <div className="form-error">{errors.occupation}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.yearsOfExperience && (
                <div className="form-error">{errors.yearsOfExperience}</div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Education</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                placeholder="Enter your College/University"
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.education && <div className="form-error">{errors.education}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Highest Degree</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Degree</option>
                <option value="High School Diploma">High School Diploma</option>
                <option value="Associate">Associate</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="Doctoral">Doctoral</option>
              </select>
              {errors.degree && <div className="form-error">{errors.degree}</div>}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Skills</label>
              <input
                type="text"
                onKeyPress={handleSkillAdd}
                className="form-input"
                placeholder="Type a skill and press Enter"
              />
              <div className="skills-container">
                {formData.skills.map((skill) => (
                  <div key={skill} className="skill-chip">
                    {skill}
                    <button onClick={() => handleSkillRemove(skill)}>&times;</button>
                  </div>
                ))}
              </div>
              {errors.skills && <div className="form-error">{errors.skills[0]}</div>}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Preferred Work Location</label>
              <select
                name="preferredWorkLocation"
                value={formData.preferredWorkLocation}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Select a location</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Flexible">Flexible</option>
              </select>
              {errors.preferredWorkLocation && (
                <div className="form-error">{errors.preferredWorkLocation}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Expected Salary</label>
              <input
                type="number"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                className="form-input"
              />
              {errors.expectedSalary && (
                <div className="form-error">{errors.expectedSalary}</div>
              )}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="form-step">
            <div className="form-group">
              <label className="form-label">Additional Information</label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="form-input"
                rows={4}
                placeholder="Enter any additional information you'd like to share"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="big-container">
      <aside className="h-screen sticky p-4 top-0 w-45 border-b border-b-gray-100 shadow-sm h-full"> 
        <SideBar />
      </aside>
      <main className="w-full pr-4">
        <div className="form-outer">
        <div className="form-container">
          <h1 className="form-title">Career Matching Quiz</h1>
          
          <div className="steps-container">
            <div className="step-line" />
            {steps.map((step, index) => (
              <div
                key={step}
                className={`step ${index + 1 === currentStep ? 'active' : ''} ${
                  index + 1 < currentStep ? 'completed' : ''
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="button-group">
              <button
                type="button"
                onClick={handleBack}
                className="button button-secondary"
                disabled={currentStep === 1}
              >
                Back
              </button>
              
              {currentStep === 7 ? (
                <button type="submit" className="button button-primary">
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="button button-primary"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
        </div>
    </main>
    </div>
  );
};

export default MultiStepFormPage; 
