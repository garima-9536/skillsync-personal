export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface SkillDTO {
  skillId: number;
  name: string;
  category: string;
  description?: string;
}

export interface UserSkillDTO {
  userSkillId: number;
  skillId: number;
  skillName: string;
  category: string;
  proficiencyLevel: ProficiencyLevel;
  yearsExperience: number;
}

export interface AddUserSkillDTO {
  skillId: number;
  proficiencyLevel: ProficiencyLevel;
  yearsExperience: number;
}
