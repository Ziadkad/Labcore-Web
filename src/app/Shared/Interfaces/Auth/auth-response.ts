import {UserRole} from "./user-role";
import {Guid} from "../Common/Guid";

export interface AuthResponse {
  id: Guid;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  photoUrl: string;
  isEmailVerified: boolean;
  token: string;
  tokenExpiresAt: Date;
}
