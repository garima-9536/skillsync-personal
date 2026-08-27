import { UserSkillDTO } from './Skill';

export type AvailabilityStatus = 'OPEN' | 'BUSY' | 'PART_TIME';

export interface UserDTO {
  userId: number;
  fullName: string;
  email: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  role: 'USER' | 'ADMIN';
  availabilityStatus: AvailabilityStatus;
  active: boolean;
  createdAt: string;
  skills: UserSkillDTO[];
}

export interface UserSummaryDTO {
  userId: number;
  fullName: string;
  email: string;
  location?: string;
  availabilityStatus: AvailabilityStatus;
  skills: UserSkillDTO[];
}

export interface UpdateUserDTO {
  fullName?: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  availabilityStatus?: AvailabilityStatus;
}
