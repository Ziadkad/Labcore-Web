import {Component, effect, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {StudyService} from "../../../../Core/Services/project-service/study.service";
import {FileService} from "../../../../Core/Services/FileService/file.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {AuthResponse} from "../../../../Shared/Interfaces/Auth/auth-response";
import {TaskItem} from "../../../../Shared/Interfaces/Project/TaskItem/task-item";
import {isAllowedToProject} from "../../../../Shared/Common/IsAllowedToProject";
import {TaskItemService} from "../../../../Core/Services/project-service/task-item.service";
import {User} from "../../../../Shared/Interfaces/User/user";
import {UserService} from "../../../../Core/Services/user-service/user.service";
import {TaskItemStatus} from "../../../../Shared/Interfaces/Project/TaskItem/task-item-status";
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { ResourceReservationService } from '../../../../Core/Services/resource-service/resource-reservation.service';
import {
  ResourceReservationWithResource
} from '../../../../Shared/Interfaces/Resource/ResourceReservation/resource-reservation-with-resource';

@Component({
  selector: 'app-task-item-detail-page',
  templateUrl: './task-item-detail-page.component.html',
  styleUrl: './task-item-detail-page.component.css'
})
export class TaskItemDetailPageComponent implements OnInit {
  loading = signal(false);
  taskItemId!: Guid;
  taskItem!: TaskItem;
  projectId!: Guid;
  currentUser: AuthResponse | null = null;
  userId: Guid | undefined;
  isAllowedToEdit = signal(false);
  assignedTo : User[] = [];
  isModalOpen: boolean = false;

  reservations: ResourceReservationWithResource[] = [];

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly taskItemService: TaskItemService,
              private readonly studyService: StudyService,
              private readonly fileService: FileService,
              private readonly toastr: ToastrService,
              private readonly authService: AuthService,
              private readonly projectService: ProjectService,
              private readonly userService : UserService,
              private readonly resourceReservationService: ResourceReservationService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userId = this.currentUser?.id;
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('taskItemId');
    if (!id) {
      throw new Error('Missing taskItemId in route');
    }
    this.taskItemId = id;
    this.loadTaskItem();
  }
  loadTaskItem(){
    this.taskItemService.getTaskItem(this.taskItemId).subscribe({
        next: data => {
          this.toastr.success('Task loaded');
          data = {
            ...data,
            taskItemStatus: this.mapStatusNumberToEnum(parseInt(data.taskItemStatus))
          }
          this.taskItem = data;
          if(data.assignedTo.length != 0){
            this.loadUsers(data.assignedTo)
          }
          if(data.resources.length != 0){
            this.loadReservations(data.resources);
          }
          this.loadStudy(data.studyId);
        }
      }
    )
  }

  loadStudy(studyId:Guid){
    this.studyService.getStudy(studyId).subscribe({
        next: data => {
          this.projectId = data.projectId;
          if(this.userId){
            isAllowedToProject(data.projectId, this.userId,this.projectService, (allowed) => {
              this.isAllowedToEdit.set(allowed);
            });
          }
        }
      }
    )
  }


  loadReservations(ids: number[]) {
    this.resourceReservationService.getReservations(ids,undefined,undefined,undefined,undefined,undefined,{page:1,pageSize:22000}).subscribe({
      next: data => {
        this.reservations = data.items;
      },
      error: error => {
        this.toastr.error('Error while loading Reservations');
      }
    })

  }


  loadUsers(researcherIds:Guid[]): void {
    this.userService.getAllUsers(
      researcherIds,
      undefined,
      undefined,
      undefined,
      { page: 1, pageSize: 500 }
    ).subscribe({
      next: data => {
        this.assignedTo = data.items;
      }
    })
  }
  downloadStudyFile(link: string): void {
    this.fileService.downloadProjectFile(link).subscribe({
      next: (fileBlob: Blob) => {
        const blobUrl = URL.createObjectURL(fileBlob);
        const newTab = window.open(blobUrl, '_blank');
        if (!newTab) {
          const message = 'Popup blocked. Please allow popups for this website.';
          this.toastr.warning(message);
        } else {
          this.toastr.success('File downloaded successfully');
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred while downloading the file.';
        this.toastr.error(message);
      }
    });
  }

  deleteProjectFile(link: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this file?');
    if (!confirmed) return;

    this.fileService.deleteProjectFile(link).subscribe({
      next: () => {
        const index = this.taskItem.pathsFiles.indexOf(link);
        if (index > -1) {
          this.taskItem.pathsFiles.splice(index, 1);
        }
        this.toastr.success('File deleted successfully');
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred while deleting the file.';
        this.toastr.error(message);
      }
    });
  }

  uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isAccessible', 'true');
    formData.append('projectId', this.projectId);
    formData.append('studyId', this.taskItem.studyId);
    formData.append('taskId', this.taskItem.id);
    this.fileService.uploadFile(formData).subscribe({
      next: (data: string) => {
        this.taskItem.pathsFiles.push(data);
        this.toastr.success('File uploaded successfully');
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred during file upload.';
        this.toastr.error(message);
      }
    });
  }

  getCleanFileName(filePath: string): string {
    const fullName = filePath.split('/').pop() ?? '';
    return fullName.length > 36 ? fullName.substring(36) : fullName;
  }


  deleteReservation(id:number){
    const confirmed = window.confirm('Are you sure you want to delete this reservation?');
    if (!confirmed) return;
    this.resourceReservationService.deleteReservation(id).subscribe({
      next: data => {
        this.toastr.success('Reservation deleted');
      },
      error: (err) => {
        this.toastr.error('There was an issue deleting Reservation');
      }
    })
  }

  goToEditTaskItem(): void {
    this.router.navigate(['/edittaskitem', this.taskItem.id]);
  }




  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.loadTaskItem();
  }

  private mapStatusNumberToEnum(value: number): TaskItemStatus {
    const map: { [key: number]: TaskItemStatus } = {
      0: TaskItemStatus.NotStarted,
      1: TaskItemStatus.InProgress,
      2: TaskItemStatus.Completed,
    };
    return map[value];
  }

  protected readonly UserRole = UserRole;
}
