import { RequestStatus } from './Collaboration';

export interface ApplicationDTO {
  applicationId: number;
  projectId: number;
  projectTitle: string;
  applicantId: number;
  applicantName: string;
  message?: string;
  status: RequestStatus;
  createdAt: string;
}

export interface CreateApplicationDTO {
  projectId: number;
  message?: string;
}
