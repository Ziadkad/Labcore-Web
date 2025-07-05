import {Component, effect, OnInit, signal} from '@angular/core';
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {ProjectWithStudies} from "../../../../Shared/Interfaces/Project/Project/project-with-studies";
import {FileService} from "../../../../Core/Services/FileService/file.service";
import {AuthResponse} from "../../../../Shared/Interfaces/Auth/auth-response";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-project-detail-page',
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.css'
})
export class ProjectDetailPageComponent implements OnInit {
  loading = signal(false);
  projectId!: Guid;
  project!: ProjectWithStudies;
  error = signal("");
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId: Guid | undefined;

  constructor(
    private readonly projectService: ProjectService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      this.userId = this.currentUser?.id;
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (!id) {
      throw new Error('Missing projectId in route');
    }
    this.projectId = id;
    this.loadProject();
  }

  loadProject() {
    this.projectService.getProjectWithStudies(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
        this.toastr.success('Project loaded successfully');
      },
      error: (err) => {
        const message = 'An error occurred while loading the project.';
        this.error.set(message);
        this.toastr.error(message);
      }
    });
  }

  downloadProjectFile(link: string): void {
    this.fileService.downloadProjectFile(link).subscribe({
      next: (fileBlob: Blob) => {
        const blobUrl = URL.createObjectURL(fileBlob);
        const newTab = window.open(blobUrl, '_blank');
        if (!newTab) {
          const message = 'Popup blocked. Please allow popups for this website.';
          this.error.set(message);
          this.toastr.warning(message);
        } else {
          this.toastr.success('File downloaded successfully');
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred while downloading the file.';
        this.error.set(message);
        this.toastr.error(message);
      }
    });
  }

  deleteProjectFile(link: string): void {
    const confirmed = window.confirm('Are you sure you want to delete this file?');
    if (!confirmed) return;

    this.fileService.deleteProjectFile(link).subscribe({
      next: () => {
        const index = this.project.pathsFiles.indexOf(link);
        if (index > -1) {
          this.project.pathsFiles.splice(index, 1);
        }
        this.toastr.success('File deleted successfully');
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred while deleting the file.';
        this.error.set(message);
        this.toastr.error(message);
      }
    });
  }

  goToEditProject(): void {
    this.router.navigate(['/editproject', this.project.id]);
  }

  goToCreateStudy(): void {
    this.router.navigate(['/createstudy', this.project.id]);
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
    formData.append('projectId', this.projectId.toString());
    formData.append('studyId', '');
    formData.append('taskId', '');

    this.fileService.uploadFile(formData).subscribe({
      next: (data: string) => {
        this.project.pathsFiles.push(data);
        this.toastr.success('File uploaded successfully');
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred during file upload.';
        this.error.set(message);
        this.toastr.error(message);
      }
    });
  }

  deleteProject(): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(this.project.id).subscribe({
        next: () => {
          this.toastr.success('Project deleted successfully');
          this.router.navigate(['/project']);
        },
        error: (err) => {
          const message = err.message ?? 'Error deleting project.';
          this.error.set(message);
          this.toastr.error(message);
        }
      });
    }
  }

  CanEditProject(): boolean {
    if (!this.userId || !this.project) {
      return false;
    }
    const { managerId, researchers } = this.project;
    return this.userId === managerId || researchers?.includes(this.userId);
  }


  getCleanFileName(filePath: string): string {
    const fullName = filePath.split('/').pop() ?? '';
    return fullName.length > 36 ? fullName.substring(36) : fullName;
  }


  statusMap: Record<number, string> = {
    0: 'Draft',
    1: 'Active',
    2: 'Completed'
  };

  getStatusLabel(status: number): string {
    return this.statusMap[status];
  }


  protected readonly UserRole = UserRole;
  protected readonly parseInt = parseInt;
}
