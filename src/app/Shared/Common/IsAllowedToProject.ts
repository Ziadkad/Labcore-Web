import { Guid } from "../Interfaces/Common/Guid";
import {ProjectService} from "../../Core/Services/project-service/project.service";

export function isAllowedToProject(
  projectId: Guid,
  userId: Guid,
  projectService: ProjectService,
  callback: (allowed: boolean) => void
): void {
  projectService.getProjectWithStudies(projectId).subscribe({
    next: (project) => {
      const allowed = userId === project.managerId || project.researchers?.includes(userId);
      callback(allowed);
    },
    error: (err) => {
      console.error(err.message || err);
      callback(false);
    }
  });
}
