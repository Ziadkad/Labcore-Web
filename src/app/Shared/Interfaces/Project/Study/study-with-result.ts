import {Guid} from "../../Common/Guid";
import {RiskLevel} from "./risk-level";
import {StudyResult} from "../StudyResult/study-result";

export interface StudyWithResult {
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
  studyResult: StudyResult
}
