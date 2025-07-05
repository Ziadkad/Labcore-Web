import {ProjectStatus} from "./project-status";
import {Guid} from "../../Common/Guid";

export interface UpdateProjectInterface {
  id: Guid;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  isPublic: boolean;
  tags: string[];
  researchers: Guid[];
}
