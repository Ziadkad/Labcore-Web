import {Guid} from "../../Common/Guid";
import {RiskLevel} from "./risk-level";

export interface Study {
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
}
