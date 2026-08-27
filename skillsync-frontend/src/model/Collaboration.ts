export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface CollaborationRequestDTO {
  requestId: number;
  projectId: number;
  projectTitle: string;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  message?: string;
  status: RequestStatus;
  createdAt: string;
}

export interface CreateCollaborationRequestDTO {
  projectId: number;
  receiverId: number;
  message?: string;
}
