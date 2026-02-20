/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: applications
 * Interface for JobApplications
 */
export interface JobApplications {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  applicationIdentifier?: string;
  /** @wixFieldType datetime */
  applicationDate?: Date | string;
  /** @wixFieldType text */
  applicationStatus?: string;
  /** @wixFieldType datetime */
  lastStatusUpdateDate?: Date | string;
  /** @wixFieldType url */
  resumeUrl?: string;
  /** @wixFieldType url */
  coverLetterUrl?: string;
  /** @wixFieldType text */
  companyFeedback?: string;
}


/**
 * Collection ID: companies
 * Interface for Companies
 */
export interface Companies {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  companyName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  companyLogo?: string;
  /** @wixFieldType text */
  industry?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType url */
  websiteURL?: string;
  /** @wixFieldType text */
  contactEmail?: string;
  /** @wixFieldType text */
  headquartersLocation?: string;
}


/**
 * Collection ID: jobpostings
 * Interface for JobPostings
 */
export interface JobPostings {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  jobTitle?: string;
  /** @wixFieldType text */
  roleDescription?: string;
  /** @wixFieldType number */
  minimumCgpa?: number;
  /** @wixFieldType text */
  requiredSkills?: string;
  /** @wixFieldType datetime */
  applicationDeadline?: Date | string;
  /** @wixFieldType text */
  jobLocation?: string;
  /** @wixFieldType text */
  employmentType?: string;
}


/**
 * Collection ID: students
 * Interface for Students
 */
export interface Students {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  fullName?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType number */
  cgpa?: number;
  /** @wixFieldType text */
  skills?: string;
  /** @wixFieldType url */
  resumeUrl?: string;
  /** @wixFieldType text */
  placementStatus?: string;
}
