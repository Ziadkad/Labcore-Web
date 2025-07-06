import {Component, computed, effect, signal} from '@angular/core';
import {AuthResponse} from "../../../../Shared/Interfaces/Auth/auth-response";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {TaskItem} from "../../../../Shared/Interfaces/Project/TaskItem/task-item";
import {Router} from "@angular/router";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {TaskItemService} from "../../../../Core/Services/project-service/task-item.service";
import {PageQueryRequest} from "../../../../Shared/Interfaces/Common/page-query-request";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-my-task-items-page',
  templateUrl: './my-task-items-page.component.html',
  styleUrl: './my-task-items-page.component.css'
})
export class MyTaskItemsPageComponent {
  loading = signal(false);
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId : Guid | undefined;

  taskItems = signal<TaskItem[]>([]);
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  pageQuery = signal<PageQueryRequest>({ page: 1, pageSize: 500, sortColumn :'startdate', sortAscending : true });

  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly taskItemService: TaskItemService ,
              private readonly toastr: ToastrService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userId = this.currentUser?.id;
      this.userRole = this.currentUser?.role;
      const params = this.filterParams(); // just track dependencies
      queueMicrotask(() => this.loadTasks(params));// async outside effect
    });
  }

  private readonly filterParams = computed(() => ({
    keyword: undefined,
    assignedTo: this.userId ? [this.userId] : [],
    startDate: this.startDate() ?? undefined,
    endDate: this.endDate() ?? undefined,
    taskItemStatus: undefined,
    pageQuery: this.pageQuery(),
  }));

  loadTasks(params : any) {
    this.loading.set(true);
    this.taskItemService.getFilteredTaskItems(  params.keyword,
      params.assignedTo,
      params.startDate,
      params.endDate,
      params.taskItemStatus,
      params.pageQuery).subscribe({
      next: result => {
        this.taskItems.set(result.items);
        this.loading.set(false);
      },
      error: () => {
        this.toastr.error("Failed to load  your TaskItems. Please try again.");
      }
    })
  }


}
