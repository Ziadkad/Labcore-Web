import {TaskItemStatus} from "./task-item-status";
import {Guid} from "../../Common/Guid";

export interface UpdateTaskItemInterface {
  id: Guid;
  label: string;
  description: string;
  assignedTo: Guid[];
  startDate: Date;
  endDate: Date;
  taskItemStatus: TaskItemStatus;
  reviewNotes?: string | null;
}
