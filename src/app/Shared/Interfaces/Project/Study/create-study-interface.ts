import {RiskLevel} from "./risk-level";
import {Guid} from "../../Common/Guid";

export interface CreateStudyInterface {
  title: string;
  objective: string;
  description: string;
  startDate: Date;
  endDate: Date;
  riskLevel: RiskLevel;
  projectId: Guid;
}
