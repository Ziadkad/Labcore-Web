import {Gender} from "./gender";

export interface Register {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  image: File;
}
