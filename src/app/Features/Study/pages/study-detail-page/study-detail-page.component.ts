import {Component, effect, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {AuthResponse} from "../../../../Shared/Interfaces/Auth/auth-response";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {ToastrService} from "ngx-toastr";
import {StudyService} from "../../../../Core/Services/project-service/study.service";
import {FileService} from "../../../../Core/Services/FileService/file.service";
import {Study} from "../../../../Shared/Interfaces/Project/Study/study";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {isAllowedToProject} from "../../../../Shared/Common/IsAllowedToProject";
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {RiskLevel} from "../../../../Shared/Interfaces/Project/Study/risk-level";

@Component({
  selector: 'app-study-detail-page',
  templateUrl: './study-detail-page.component.html',
  styleUrl: './study-detail-page.component.css'
})
export class StudyDetailPageComponent implements OnInit {
  loading = signal(false);
  studyId!: Guid;
  study!: Study;
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId: Guid | undefined;
  isAllowedToEdit = signal(false);
  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly studyService: StudyService,
              private readonly fileService: FileService,
              private readonly toastr: ToastrService,
              private readonly authService: AuthService,
              private readonly projectService: ProjectService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      this.userId = this.currentUser?.id;
    });
  }
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('studyId');
    if (!id) {
      throw new Error('Missing projectId in route');
    }
    this.studyId = id;
    this.loadStudy();
  }


  loadStudy(){
      this.studyService.getStudy(this.studyId).subscribe({
          next: data => {
            this.toastr.success('Study loaded');
            data ={
              ...data,
              riskLevel : this.mapStatusNumberToEnum(parseInt(data.riskLevel))
            }
            this.study = data;
            if(this.userId){
              isAllowedToProject(data.projectId, this.userId,this.projectService, (allowed) => {
                this.isAllowedToEdit.set(allowed);
              });
            }
          },
          error: (err) => {
            const message = err.message ?? 'Error loading the Study.';
            this.toastr.error(message);
          }
        }
      )
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
        const index = this.study.pathsFiles.indexOf(link);
        if (index > -1) {
          this.study.pathsFiles.splice(index, 1);
        }
        this.toastr.success('File deleted successfully');
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred while deleting the file.';
        this.toastr.error(message);
      }
    });
  }


  DeleteStudy(): void {
    if (confirm('Are you sure you want to delete this study?')) {
      this.studyService.deleteStudy(this.study.id).subscribe({
        next: () => {
          this.toastr.success('Study deleted successfully');
          this.router.navigate(['/project', this.study.projectId]);
        },
        error: () => {
          this.toastr.error('Failed to delete the study');
        }
      });
    }
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
    formData.append('projectId', this.study.projectId);
    formData.append('studyId', this.study.id);
    formData.append('taskId', '');
    this.fileService.uploadFile(formData).subscribe({
      next: (data: string) => {
        this.study.pathsFiles.push(data);
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

  goToEditStudy(): void {
    this.router.navigate(['/editstudy', this.study.id]);
  }

  goToAddTask(): void {
    this.router.navigate(['/createtaskitem', this.study.id]);
  }

  goToViewTasks(): void {
    this.router.navigate(['/taskitemlist', this.study.id]);
  }

  private mapStatusNumberToEnum(value: number): RiskLevel {
    const map: { [key: number]: RiskLevel } = {
      0: RiskLevel.Low,
      1: RiskLevel.Medium,
      2: RiskLevel.High,
    };
    return map[value];
  }

  protected readonly parseInt = parseInt;
  protected readonly UserRole = UserRole;
}
