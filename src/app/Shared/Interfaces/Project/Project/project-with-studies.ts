import {Study} from "../Study/study";
import {Guid} from "../../Common/Guid";
import {ProjectStatus} from "./project-status";

export interface ProjectWithStudies {
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
  studies: Study[];
}
