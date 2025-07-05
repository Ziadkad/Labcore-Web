import {Gender} from "../Auth/gender";
import {UserRole} from "../Auth/user-role";
import {Guid} from "../Common/Guid";

export interface User {
  id: Guid;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  role: UserRole;
  photoUrl?: string | null;
}
