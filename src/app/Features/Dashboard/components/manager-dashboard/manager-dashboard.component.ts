import { Component, effect, OnInit } from '@angular/core';
import { ProjectStatus } from '../../../../Shared/Interfaces/Project/Project/project-status';
import { Guid } from '../../../../Shared/Interfaces/Common/Guid';
import { AuthResponse } from '../../../../Shared/Interfaces/Auth/auth-response';
import { AuthService } from '../../../../Core/Services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ProjectService } from '../../../../Core/Services/project-service/project.service';
import { ResourceReservationService } from '../../../../Core/Services/resource-service/resource-reservation.service';
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { Project } from '../../../../Shared/Interfaces/Project/Project/project';
import { StudyService } from '../../../../Core/Services/project-service/study.service';
import { TaskItem } from '../../../../Shared/Interfaces/Project/TaskItem/task-item';
import { ProjectWithStudies } from '../../../../Shared/Interfaces/Project/Project/project-with-studies';
import { ResourceReservationWithResource } from '../../../../Shared/Interfaces/Resource/ResourceReservation/resource-reservation-with-resource';
import { catchError, map, Observable, of } from 'rxjs';
import { UserService } from '../../../../Core/Services/user-service/user.service';
import { TaskItemStatus } from '../../../../Shared/Interfaces/Project/TaskItem/task-item-status';
import {
  Chart,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css',
})

export class ManagerDashboardComponent {
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId: Guid | undefined;
  projectsActive: Project[] = [];
  projectsInDraft: Project[] = [];
  selectedProject: ProjectWithStudies | undefined;
  tasks: TaskItem[] = [];
  completedTasks: TaskItem[] = [];
  inProgressTasks: TaskItem[] = [];
  notStartedTasks: TaskItem[] = [];
  myFutureReservations: ResourceReservationWithResource[] = [];
  userFullNames = new Map<Guid, Observable<string | null>>();
  chart: Chart | undefined;
  progressChart: Chart | undefined;




  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly studyService: StudyService,
    private readonly resourceReservationService: ResourceReservationService,
    private readonly userService: UserService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      this.userId = this.currentUser?.id;
      this.loadReservations();
      this.loadProjects(ProjectStatus.Draft);
      this.loadProjects(ProjectStatus.Active);
    });
  }

  loadProjects(status: ProjectStatus) {
    let params = {
      keyword: undefined as string | undefined,
      startDate: new Date(new Date().getDate() - 90) .toISOString(),
      endDate: undefined as string | undefined,
      status: status,
      progressPercentageMin: undefined as number | undefined,
      progressPercentageMax: undefined as number | undefined,
      tags: undefined as string[] | undefined,
      researchers: undefined as Guid[] | undefined,
      manager: this.userId,
      pageQuery: {
        page: 1,
        pageSize: 3,
      },
    };

    this.projectService.getAllProjects(params).subscribe({
      next: (result) => {
        if (status === ProjectStatus.Draft) {
          this.projectsInDraft = result.items;
        }
        if (status === ProjectStatus.Active) {
          this.projectsActive = result.items;
          this.loadSelectedProject(result.items[0].id);
        }
      },
    });
  }

  loadSelectedProject(id: Guid) {
    this.projectService.getProjectWithStudies(id).subscribe({
      next: (result) => {
        this.resetTasks();
        this.selectedProject = result;
        result.studies.forEach((study) => {
          this.loadTasks(study.id);
        });
      },
    });
  }

  loadTasks(id: Guid) {
    const today = new Date();
    const twoWeeksBefore = new Date(today);
    twoWeeksBefore.setDate(today.getDate() - 14);
    const twoWeeksAfter = new Date(today);
    twoWeeksAfter.setDate(today.getDate() + 14);
    const options = {
      keyword: undefined,
      assignedTo: undefined,
      startDate: twoWeeksBefore.toISOString(),
      endDate: twoWeeksAfter.toISOString(),
      taskItemStatus: undefined,
      pageQueryRequest: {
        page: 1,
        pageSize: 100000,
      },
    };
    this.studyService.getStudyWithTaskItems(id).subscribe({
      next: (result) => {
        let tasks = result.taskItems?.map(item => ({
          ...item,
          taskItemStatus: this.mapStatusNumberToEnum(parseInt(item.taskItemStatus))
        }));
        this.tasks.push(...tasks);

        this.completedTasks = this.tasks
          .filter(t => t.taskItemStatus === TaskItemStatus.Completed)
          .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
          .slice(0, 3); // Only the top 3 most recent

        this.inProgressTasks = this.tasks
          .filter(t => t.taskItemStatus === TaskItemStatus.InProgress);

        this.notStartedTasks = this.tasks
          .filter(t => t.taskItemStatus === TaskItemStatus.NotStarted)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 3); // Only the top 3 soonest

        this.updateChart();

      },
    });
  }

  GetUserFullName(id: Guid): Observable<string | null> {
    if (this.userFullNames.has(id)) {
      return this.userFullNames.get(id)!;
    }

    const fullName$ = this.userService.getAllUsers([id], undefined, undefined, undefined, { page: 1, pageSize: 1 })
      .pipe(
        map(result => {
          const user = result.items[0];
          return user ? `${user.firstName} ${user.lastName}` : null;
        }),
        catchError(() => of(null))
      );

    this.userFullNames.set(id, fullName$);
    return fullName$;
  }


  resetTasks() {
    this.tasks = [];
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

  updateChart() {
    const completed = this.tasks.filter(t => t.taskItemStatus === TaskItemStatus.Completed).length;
    const inProgress = this.tasks.filter(t => t.taskItemStatus === TaskItemStatus.InProgress).length;
    const notStarted = this.tasks.filter(t => t.taskItemStatus === TaskItemStatus.NotStarted).length;

    // Chart 1: Tasks Breakdown
    const taskCanvas = document.getElementById('projectChart') as HTMLCanvasElement;
    if (taskCanvas && this.chart) this.chart.destroy();
    if (taskCanvas) {
      this.chart = new Chart(taskCanvas, {
        type: 'pie',
        data: {
          labels: ['Tasks Completed', 'Tasks In Progress', 'Tasks Not Started'],
          datasets: [{
            data: [completed, inProgress, notStarted],
            backgroundColor: ['#34d399', '#60a5fa', '#fbbf24'],
            borderColor: ['#10b981', '#3b82f6', '#f59e0b'],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.parsed} task(s)`
              }
            }
          }
        }
      });
    }

    // Chart 2: Project Progress
    const progressCanvas = document.getElementById('progressChart') as HTMLCanvasElement;
    if (progressCanvas && this.progressChart) this.progressChart.destroy();
    if (progressCanvas && this.selectedProject) {
      const progress = this.selectedProject.progressPercentage ?? 0;
      this.progressChart = new Chart(progressCanvas, {
        type: 'pie',
        data: {
          labels: ['Completed %', 'Remaining %'],
          datasets: [{
            data: [progress, 100 - progress],
            backgroundColor: ['#4ade80', '#e5e7eb'],
            borderColor: ['#22c55e', '#d1d5db'],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' },
            tooltip: {
              callbacks: {
                label: (context) => `${context.label}: ${context.parsed}%`
              }
            }
          }
        }
      });
    }
  }


  onTaskClick(taskId: Guid): void {
      this.router.navigate(['/taskitem', taskId]);
  }

  openCreateProjectModal(){
    this.router.navigate(['/createproject']);
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
