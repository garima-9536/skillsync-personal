import axios from 'axios';
import { UserDTO, UserSummaryDTO, UpdateUserDTO } from '../model/User';
import { UserSkillDTO, AddUserSkillDTO } from '../model/Skill';
import { PageResponse } from '../model/Pagination';
import Messages from '../messages/Messages';

const UserService = {
  getUserById(userId: number): Promise<UserDTO> {
    return axios.get(`${Messages.BASE_URL}/users/${userId}`).then(res => res.data);
  },

  updateUser(userId: number, data: UpdateUserDTO): Promise<UserDTO> {
    return axios.put(`${Messages.BASE_URL}/users/${userId}`, data).then(res => res.data);
  },

  searchUsers(params: {
    skillIds?: number[];
    location?: string;
    availability?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<UserSummaryDTO>> {
    return axios.get(`${Messages.BASE_URL}/users/search`, { params }).then(res => res.data);
  },

  addSkill(userId: number, data: AddUserSkillDTO): Promise<UserSkillDTO> {
    return axios.post(`${Messages.BASE_URL}/users/${userId}/skills`, data).then(res => res.data);
  },

  updateSkill(userId: number, userSkillId: number, data: AddUserSkillDTO): Promise<UserSkillDTO> {
    return axios.put(`${Messages.BASE_URL}/users/${userId}/skills/${userSkillId}`, data).then(res => res.data);
  },

  removeSkill(userId: number, userSkillId: number): Promise<void> {
    return axios.delete(`${Messages.BASE_URL}/users/${userId}/skills/${userSkillId}`).then(res => res.data);
  },
};

export default UserService;
