import axios from 'axios';
import { MatchedUserDTO, MatchedProjectDTO } from '../model/Matching';
import Messages from '../messages/Messages';

const MatchingService = {
  findMatchesForProject(projectId: number): Promise<MatchedUserDTO[]> {
    return axios.get(`${Messages.BASE_URL}/matching/project/${projectId}`).then(res => res.data);
  },

  findMatchingProjects(userId: number): Promise<MatchedProjectDTO[]> {
    return axios.get(`${Messages.BASE_URL}/matching/user/${userId}`).then(res => res.data);
  },
};

export default MatchingService;
