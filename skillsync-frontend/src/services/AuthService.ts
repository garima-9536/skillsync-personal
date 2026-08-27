import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../model/Auth';
import Messages from '../messages/Messages';

const AuthService = {
  register(data: RegisterRequest): Promise<AuthResponse> {
    return axios.post(`${Messages.BASE_URL}/auth/register`, data).then(res => res.data);
  },

  login(data: LoginRequest): Promise<AuthResponse> {
    return axios.post(`${Messages.BASE_URL}/auth/login`, data).then(res => res.data);
  },
};

export default AuthService;
