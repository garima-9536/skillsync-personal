export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
