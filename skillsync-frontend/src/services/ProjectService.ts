import axios from 'axios';
import { ProjectDTO, ProjectSummaryDTO, CreateProjectDTO, UpdateProjectDTO } from '../model/Project';
import { ApplicationDTO } from '../model/Application';
import { PageResponse } from '../model/Pagination';
import Messages from '../messages/Messages';

const ProjectService = {
  getProjects(params: {
    search?: string;
    skillId?: number;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<ProjectSummaryDTO>> {
    return axios.get(`${Messages.BASE_URL}/projects`, { params }).then(res => res.data);
  },

  getMyProjects(ownerId: number): Promise<ProjectSummaryDTO[]> {
    return axios.get(`${Messages.BASE_URL}/projects/my`, { params: { ownerId } }).then(res => res.data);
  },

  getProjectById(projectId: number): Promise<ProjectDTO> {
    return axios.get(`${Messages.BASE_URL}/projects/${projectId}`).then(res => res.data);
  },

  createProject(ownerId: number, data: CreateProjectDTO): Promise<ProjectDTO> {
    return axios.post(`${Messages.BASE_URL}/projects`, data, { params: { ownerId } }).then(res => res.data);
  },

  updateProject(projectId: number, ownerId: number, data: UpdateProjectDTO): Promise<ProjectDTO> {
    return axios.put(`${Messages.BASE_URL}/projects/${projectId}`, data, { params: { ownerId } }).then(res => res.data);
  },

  deleteProject(projectId: number, ownerId: number): Promise<void> {
    return axios.delete(`${Messages.BASE_URL}/projects/${projectId}`, { params: { ownerId } }).then(res => res.data);
  },

  removeMember(projectId: number, userId: number, ownerId: number): Promise<void> {
    return axios.delete(`${Messages.BASE_URL}/projects/${projectId}/members/${userId}`, { params: { ownerId } }).then(res => res.data);
  },

  applyToProject(projectId: number, applicantId: number, message?: string): Promise<ApplicationDTO> {
    return axios.post(`${Messages.BASE_URL}/projects/${projectId}/apply`, { projectId, message }, { params: { applicantId } }).then(res => res.data);
  },

  getMyApplications(applicantId: number): Promise<ApplicationDTO[]> {
    return axios.get(`${Messages.BASE_URL}/applications/my`, { params: { applicantId } }).then(res => res.data);
  },

  getApplications(projectId: number, ownerId: number): Promise<ApplicationDTO[]> {
    return axios.get(`${Messages.BASE_URL}/projects/${projectId}/applications`, { params: { ownerId } }).then(res => res.data);
  },

  acceptApplication(projectId: number, applicationId: number, ownerId: number): Promise<void> {
    return axios.put(`${Messages.BASE_URL}/projects/${projectId}/applications/${applicationId}/accept`, {}, { params: { ownerId } }).then(res => res.data);
  },

  rejectApplication(projectId: number, applicationId: number, ownerId: number): Promise<void> {
    return axios.put(`${Messages.BASE_URL}/projects/${projectId}/applications/${applicationId}/reject`, {}, { params: { ownerId } }).then(res => res.data);
  },
};

export default ProjectService;
