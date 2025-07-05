import {Component, effect, signal} from '@angular/core';
import {AuthResponse} from "../../../../Shared/Interfaces/Auth/auth-response";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {TaskItem} from "../../../../Shared/Interfaces/Project/TaskItem/task-item";
import {Router} from "@angular/router";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {TaskItemService} from "../../../../Core/Services/project-service/task-item.service";

@Component({
  selector: 'app-my-task-items-page',
  templateUrl: './my-task-items-page.component.html',
  styleUrl: './my-task-items-page.component.css'
})
export class MyTaskItemsPageComponent {
  loading = signal(false);
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId: Guid | undefined;
  taskItems = signal<TaskItem[]>([]);

  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly taskItemService: TaskItemService ,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      this.userId = this.currentUser?.id;
    });
  }
  ngOnInit(): void {}


  loadTasks(params : any) {
    this.loading.set(true);
    this.taskItemService.getFilteredTaskItems()

  }


}
