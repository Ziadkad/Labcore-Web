import {Component, Input} from '@angular/core';
import {Project} from "../../../../Shared/Interfaces/Project/Project/project";
import {ProjectStatus} from "../../../../Shared/Interfaces/Project/Project/project-status";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {Router} from "@angular/router";

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  ProjectStatus  = ProjectStatus;
  statusMap: Record<number, string> = {
    0: 'Draft',
    1: 'Active',
    2: 'Completed'
  };
  constructor(private  router: Router) {
  }

  getStatusLabel(status: number): string {
    return this.statusMap[status];
  }

  onClickHandler(projectId: Guid){
      this.router.navigate(['/project', projectId]);
  }

  protected readonly parseInt = parseInt;
}
