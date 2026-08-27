import { SkillDTO } from './Skill';

export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
export type MemberRole = 'OWNER' | 'MEMBER';

export interface ProjectMemberDTO {
  userId: number;
  fullName: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
}

export interface ProjectDTO {
  projectId: number;
  title: string;
  description?: string;
  status: ProjectStatus;
  ownerId: number;
  ownerName: string;
  maxTeamSize: number;
  memberCount: number;
  requiredSkills: SkillDTO[];
  members: ProjectMemberDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummaryDTO {
  projectId: number;
  title: string;
  description?: string;
  status: ProjectStatus;
  ownerName: string;
  memberCount: number;
  maxTeamSize: number;
  requiredSkills: SkillDTO[];
  createdAt: string;
}

export interface CreateProjectDTO {
  title: string;
  description?: string;
  maxTeamSize: number;
  requiredSkillIds: number[];
}

export interface UpdateProjectDTO {
  title: string;
  description?: string;
  status: string;
  maxTeamSize: number;
  requiredSkillIds: number[];
}
