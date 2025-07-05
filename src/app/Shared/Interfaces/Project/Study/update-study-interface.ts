import {Guid} from "../../Common/Guid";
import {RiskLevel} from "./risk-level";

export interface UpdateStudyInterface {
  id: Guid;
  title: string;
  objective: string;
  description: string;
  startDate: Date;
  endDate: Date;
  riskLevel: RiskLevel;
}
