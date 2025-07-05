import {Guid} from "../../Common/Guid";

export interface CreateTaskItemInterface {
  label: string;
  description: string;
  startDate: Date;
  endDate: Date;
  studyId: Guid;
}
