import {TaskItemStatus} from "../TaskItem/task-item-status";
import {Guid} from "../../Common/Guid";
import {RiskLevel} from "./risk-level";
import {TaskItem} from "../TaskItem/task-item";

export interface StudyWithTaskItems {
  id: Guid;
  title: string;
  objective: string;
  description: string;
  startDate: Date;
  endDate: Date;
  riskLevel: RiskLevel;
  pathsFiles: string[];
  resources: number[];
  projectId: Guid;
  taskItems: TaskItem[];
  taskCount: number;
}
