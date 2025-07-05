import {Component, effect, Input, OnInit, signal} from '@angular/core';
import {TaskItem} from "../../../../Shared/Interfaces/Project/TaskItem/task-item";
import {TaskItemStatus} from "../../../../Shared/Interfaces/Project/TaskItem/task-item-status";
import {TaskItemService} from "../../../../Core/Services/project-service/task-item.service";
import {Router} from "@angular/router";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {AuthResponse} from "../../../../Shared/Interfaces/Auth/auth-response";
import {isAllowedToProject} from "../../../../Shared/Common/IsAllowedToProject";
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {StudyService} from "../../../../Core/Services/project-service/study.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-task-item-table',
  templateUrl: './task-item-table.component.html',
  styleUrl: './task-item-table.component.css'
})
export class TaskItemTableComponent implements OnInit {
 @Input() taskItems : TaskItem[] | undefined;
  currentUser: AuthResponse | null = null;
  userId: Guid | undefined;
  isAllowedToEdit = signal(false);
  constructor(private readonly taskItemService: TaskItemService,
              private readonly router: Router,
              private readonly authService: AuthService,
              private readonly studyService: StudyService,
              private readonly projectService: ProjectService,
              private readonly toastr: ToastrService,
              ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userId = this.currentUser?.id;
    });
  }

  ngOnInit(): void {
   this.taskItems = this.taskItems?.map(item => ({
     ...item,
     taskItemStatus: this.mapStatusNumberToEnum(parseInt(item.taskItemStatus))
   }));
   if (this.taskItems !== undefined && this.taskItems.length > 0) {
     this.loadStudy(this.taskItems[0].studyId);
   }
 }

  onStatusChange(itemId: string, newStatus: TaskItemStatus): void {
    this.taskItemService.updateTaskItemStatus(itemId, newStatus).subscribe({
      next: (data: TaskItem) => {
        this.toastr.success(`The Task ${data.label} is now ${newStatus}`);
      },
      error: err => {
        const message = err.message ?? 'An error occurred while changing the status.';
        this.toastr.error(message);
      }
    })
  }


  onViewDetails(id : Guid) {
    this.router.navigate([`/taskitem`,id]);
  }

  onUpdate(id : Guid) {
    this.router.navigate(['/edittaskitem',id]);
  }


  onDelete(id : Guid) {
    const confirmed = window.confirm('Are you sure you want to delete this task item?');
    if (!confirmed) return;
    this.taskItemService.deleteTaskItem(id).subscribe({
      next: () => {
        this.toastr.success('TaskItem deleted successfully');
        this.router.navigate(['/taskitem']);
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred while deleting the file.';
        this.toastr.error(message);
      }
    })
  }



  loadStudy(studyId : Guid) {
    this.studyService.getStudy(studyId).subscribe({
        next: data => {
          if(this.userId){
            isAllowedToProject(data.projectId, this.userId,this.projectService, (allowed) => {
              this.isAllowedToEdit.set(allowed);
            });
          }
        }
      }
    )
  }
  mapStatusNumberToEnum(value: number): TaskItemStatus {
    const map: { [key: number]: TaskItemStatus } = {
      0: TaskItemStatus.NotStarted,
      1: TaskItemStatus.InProgress,
      2: TaskItemStatus.Completed,
    };
    return map[value];
  }

  taskItemStatusOptions = Object.values(TaskItemStatus) as TaskItemStatus[];

  protected readonly parseInt = parseInt;
}
