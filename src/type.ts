export interface UserProfile {
  id?: number | string;
  email: string;
  username?: string;
  name?: string;
  bio?: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: UserProfile;
}

export const TYPES_LOADED = true;