import axios from 'axios';
import { CollaborationRequestDTO, CreateCollaborationRequestDTO } from '../model/Collaboration';
import Messages from '../messages/Messages';

const CollaborationService = {
  sendRequest(senderId: number, data: CreateCollaborationRequestDTO): Promise<CollaborationRequestDTO> {
    return axios.post(`${Messages.BASE_URL}/collaboration-requests`, data, { params: { senderId } }).then(res => res.data);
  },

  getReceivedRequests(userId: number): Promise<CollaborationRequestDTO[]> {
    return axios.get(`${Messages.BASE_URL}/collaboration-requests/received`, { params: { userId } }).then(res => res.data);
  },

  getSentRequests(userId: number): Promise<CollaborationRequestDTO[]> {
    return axios.get(`${Messages.BASE_URL}/collaboration-requests/sent`, { params: { userId } }).then(res => res.data);
  },

  acceptRequest(requestId: number, userId: number): Promise<void> {
    return axios.put(`${Messages.BASE_URL}/collaboration-requests/${requestId}/accept`, {}, { params: { userId } }).then(res => res.data);
  },

  rejectRequest(requestId: number, userId: number): Promise<void> {
    return axios.put(`${Messages.BASE_URL}/collaboration-requests/${requestId}/reject`, {}, { params: { userId } }).then(res => res.data);
  },
};

export default CollaborationService;
