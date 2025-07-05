import {Guid} from "../../Common/Guid";

export interface StudyResult {
  id: Guid;
  result: string;
  studyId: Guid;
  pathsFiles: string[];
}
