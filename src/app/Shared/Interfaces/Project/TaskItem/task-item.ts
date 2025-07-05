import {Guid} from "../../Common/Guid";
import {TaskItemStatus} from "./task-item-status";

export interface TaskItem {
  id: Guid;
  label: string;
  description: string;
  assignedTo: Guid[];
  startDate: Date;
  endDate: Date;
  taskItemStatus: TaskItemStatus;
  pathsFiles: string[];
  resources: number[];
  reviewNotes: string;
  studyId: Guid;
}
