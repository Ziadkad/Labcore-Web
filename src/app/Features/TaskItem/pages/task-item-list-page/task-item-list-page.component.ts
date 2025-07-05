import {Component, computed, effect, signal} from '@angular/core';
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {StudyWithTaskItems} from "../../../../Shared/Interfaces/Project/Study/study-with-task-items";
import {TaskItemStatus} from "../../../../Shared/Interfaces/Project/TaskItem/task-item-status";
import {AuthResponse} from "../../../../Shared/Interfaces/Auth/auth-response";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {ActivatedRoute, Router} from "@angular/router";
import {StudyService} from "../../../../Core/Services/project-service/study.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {PageQueryRequest} from "../../../../Shared/Interfaces/Common/page-query-request";
import {isAllowedToProject} from "../../../../Shared/Common/IsAllowedToProject";

@Component({
  selector: 'app-task-item-list-page',
  templateUrl: './task-item-list-page.component.html',
  styleUrl: './task-item-list-page.component.css'
})
export class TaskItemListPageComponent {
  loading = signal(false);
  studyId!: Guid;
  study = signal<StudyWithTaskItems | null>(null);
  keyword = signal<string>('');
  assignedTo = signal<string>('');
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  taskItemStatus = signal<TaskItemStatus | null>(null);
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId: Guid | undefined;
  isAllowedToEdit = signal(false);
  pageQuery = signal<PageQueryRequest>({ page: 1, pageSize: 10, sortColumn :'startdate', sortAscending : true });
  pageCount! : number;

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly studyService: StudyService,
              private readonly toastr: ToastrService,
              private readonly authService: AuthService,
              private readonly projectService: ProjectService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      this.userId = this.currentUser?.id;
      const params = this.filterParams(); // just track dependencies
      queueMicrotask(() => this.loadTasks(params));// async outside effect
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('studyId');
    if (!id) {
      throw new Error('Missing projectId in route');
    }
    this.studyId = id;

  }


  private readonly filterParams = computed(() => ({
    keyword: this.keyword() || undefined,
    assignedTo: this.assignedTo() ? [this.assignedTo()] : [],
    startDate: this.startDate() ?? undefined,
    endDate: this.endDate() ?? undefined,
    taskItemStatus: this.taskItemStatus() ?? undefined,
    pageQuery: this.pageQuery(),
  }));

  loadTasks(params : any) {
    this.loading.set(true);
    this.studyService.getStudyWithTaskItems(this.studyId,params).subscribe({
      next: result => {
        this.study.set(result);
        this.getTotalPage();
        this.loading.set(false);
        if (this.userId) {
          isAllowedToProject(result.projectId, this.userId, this.projectService, (allowed) => {
            this.isAllowedToEdit.set(allowed);
          });
        }
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }


  getTotalPage(): void {
    const total = this.study()?.taskCount ?? 0;
    const size = this.pageQuery().pageSize;
    this.pageCount = Math.ceil(total / size);
  }
  changePage(page: number): void {
    if (page > 0 && page <= this.pageCount) {
      this.pageQuery.update(p => ({ ...p, page }));
    }
  }

  isFirstPage(): boolean {
    const current = this.pageQuery();
    return current.page == 1;
  }

  isLastPage(): boolean {
    const current = this.pageQuery();
    return current.page >= this.pageCount;
  }

  goToAddTask(){
    this.router.navigate(['/createtaskitem',this.studyId]);
  }

  getKeyword(): string {
    return this.keyword();
  }

  getAssignedTo(): string {
    return this.assignedTo();
  }

  getStartDate(): Date | null {
    return this.startDate();
  }

  getEndDate(): Date | null {
    return this.endDate();
  }

  getTaskItemStatus(): TaskItemStatus | null {
    return this.taskItemStatus();
  }

// Setters
  setKeyword(value: string): void {
    this.keyword.set(value);
  }

  setAssignedTo(value: string): void {
    this.assignedTo.set(value);
  }

  setStartDate(value: Date | null): void {
    this.startDate.set(value);
  }

  setEndDate(value: Date | null): void {
    this.endDate.set(value);
  }

  setTaskItemStatus(value: TaskItemStatus | null): void {
    this.taskItemStatus.set(value);
  }


  protected readonly TaskItemStatus = TaskItemStatus;
}
