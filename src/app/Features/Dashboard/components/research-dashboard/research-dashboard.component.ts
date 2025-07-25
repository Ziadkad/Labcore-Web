import { Component, effect, OnInit } from '@angular/core';
import { AuthService } from '../../../../Core/Services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ResourceReservationService } from '../../../../Core/Services/resource-service/resource-reservation.service';
import { AuthResponse } from '../../../../Shared/Interfaces/Auth/auth-response';
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { Guid } from '../../../../Shared/Interfaces/Common/Guid';
import {
  ResourceReservationWithResource
} from '../../../../Shared/Interfaces/Resource/ResourceReservation/resource-reservation-with-resource';
import { TaskItemService } from '../../../../Core/Services/project-service/task-item.service';
import { TaskItem } from '../../../../Shared/Interfaces/Project/TaskItem/task-item';
import { TaskItemStatus } from '../../../../Shared/Interfaces/Project/TaskItem/task-item-status';

@Component({
  selector: 'app-research-dashboard',
  templateUrl: './research-dashboard.component.html',
  styleUrl: './research-dashboard.component.css'
})
export class ResearchDashboardComponent {
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId: Guid | undefined;
  myFutureReservations: ResourceReservationWithResource[] = [];
  myTasks: TaskItem[] = [];
  inProgressTasks: TaskItem[] = [];
  notStartedTasks: TaskItem[] = [];



  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly taskItemService: TaskItemService,
    private readonly resourceReservationService: ResourceReservationService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      this.userId = this.currentUser?.id;
      if (this.userId) {
        this.loadTasks();
        this.loadReservations();
      }
    });
  }


  loadTasks(): void {
    if(!this.userId){
      console.warn("User ID is undefined. Aborting loadTasks.");
      return;
    }
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);


    this.taskItemService.getFilteredTaskItems(
      undefined,
      [this.userId],
      sixMonthsAgo,
      undefined,
      undefined,
      { page: 1, pageSize: 3000 }
    ).subscribe({
      next: data => {
        this.myTasks = data.items.map(item => ({
          ...item,
          taskItemStatus: this.mapStatusNumberToEnum(parseInt(item.taskItemStatus))
        }));

        this.inProgressTasks = this.myTasks
          .filter(t => t.taskItemStatus === TaskItemStatus.InProgress)
          .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

        this.notStartedTasks = this.myTasks
          .filter(t => t.taskItemStatus === TaskItemStatus.NotStarted)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 5);

      },
      error: err => {
        console.error("Failed to load tasks", err);
      }
    });
  }

  loadReservations() {
    this.resourceReservationService
      .getReservations(undefined, undefined, this.userId, undefined, new Date(), undefined, {
        page: 1,
        pageSize: 10,
      })
      .subscribe({
        next: (result) => {
          this.myFutureReservations = result.items;
        },
      });
  }


  mapStatusNumberToEnum(value: number): TaskItemStatus {
    const map: { [key: number]: TaskItemStatus } = {
      0: TaskItemStatus.NotStarted,
      1: TaskItemStatus.InProgress,
      2: TaskItemStatus.Completed,
    };
    return map[value];
  }


}
