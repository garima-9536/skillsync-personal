import axios from 'axios';
import { ApplicationDTO } from '../model/Application';
import Messages from '../messages/Messages';

const ApplicationService = {
  getMyApplications(applicantId: number): Promise<ApplicationDTO[]> {
    return axios.get(`${Messages.BASE_URL}/applications/my`, { params: { applicantId } }).then(res => res.data);
  },
};

export default ApplicationService;
