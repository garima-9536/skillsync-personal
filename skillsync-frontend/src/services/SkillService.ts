import axios from 'axios';
import { SkillDTO } from '../model/Skill';
import Messages from '../messages/Messages';

const SkillService = {
  getAllSkills(category?: string): Promise<SkillDTO[]> {
    return axios.get(`${Messages.BASE_URL}/skills`, { params: { category } }).then(res => res.data);
  },

  createSkill(data: SkillDTO): Promise<SkillDTO> {
    return axios.post(`${Messages.BASE_URL}/skills`, data).then(res => res.data);
  },
};

export default SkillService;
