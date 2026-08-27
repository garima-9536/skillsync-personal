import { UserSkillDTO, SkillDTO } from './Skill';
import { ProjectStatus } from './Project';

export interface MatchedUserDTO {
  userId: number;
  fullName: string;
  email: string;
  location?: string;
  matchScore: number;
  matchingSkills: UserSkillDTO[];
}

export interface MatchedProjectDTO {
  projectId: number;
  title: string;
  description?: string;
  status: ProjectStatus;
  ownerName: string;
  memberCount: number;
  maxTeamSize: number;
  matchScore: number;
  matchingSkills: SkillDTO[];
  createdAt: string;
}
