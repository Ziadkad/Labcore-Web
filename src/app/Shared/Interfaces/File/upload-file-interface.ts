import {Guid} from "../Common/Guid";

export interface UploadFileInterface {
  file: File;
  isAccessible: boolean;
  projectId: Guid;
  studyId?: Guid | null;
  taskId?: Guid | null;
}
