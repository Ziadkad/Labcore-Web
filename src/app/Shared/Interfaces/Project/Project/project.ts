import {Guid} from "../../Common/Guid";
import {ProjectStatus} from "./project-status";

export interface Project {
  id: Guid;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  isPublic: boolean;
  progressPercentage: number;
  tags: string[];
  pathsFiles: string[];
  researchers: Guid[];
  managerId: Guid;
  qId: Guid | null;
}
