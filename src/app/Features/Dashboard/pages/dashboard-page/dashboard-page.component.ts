import { Component, effect, OnInit } from '@angular/core';
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { AuthResponse } from '../../../../Shared/Interfaces/Auth/auth-response';
import { AuthService } from '../../../../Core/Services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ProjectService } from '../../../../Core/Services/project-service/project.service';
import { Guid } from '../../../../Shared/Interfaces/Common/Guid';
import { ProjectStatus } from '../../../../Shared/Interfaces/Project/Project/project-status';
import { ResourceReservationService } from '../../../../Core/Services/resource-service/resource-reservation.service';
import { ResourceService } from '../../../../Core/Services/resource-service/resource.service';
import { ResourceStatus } from '../../../../Shared/Interfaces/Resource/Resource/resource-status';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent{
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  userId: Guid | undefined;
  myProjectsCount: number = 0;
  myFutureReservationsCount: number = 0;
  AvailableResourceCount: number = 0;
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly resourceReservationService: ResourceReservationService,
    private readonly resourceService: ResourceService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      this.userId = this.currentUser?.id;

      this.loadProjects();
      this.loadResources();
      this.loadReservations();
    });
  }


  loadProjects() {
    let params = {
      keyword: undefined as string | undefined,
      startDate: undefined as string | undefined,
      endDate: undefined as string | undefined,
      status: undefined as ProjectStatus | undefined,
      progressPercentageMin: undefined as number | undefined,
      progressPercentageMax: undefined as number | undefined,
      tags: undefined as string[] | undefined,
      researchers: undefined as Guid[] | undefined,
      manager: undefined as Guid | undefined,
      pageQuery: {
        page: 1,
        pageSize: 10,
      },
    };
    console.log(this.userRole);
    console.log(this.userId);
    if (this.userRole === UserRole.Researcher && this.userId) {
      params.researchers = [this.userId];
    } else if (this.userRole === UserRole.Manager && this.userId) {
      params.manager = this.userId;
    }
    console.log(params)
    this.projectService.getAllProjects(params).subscribe({
      next: (result) => {
        this.myProjectsCount = result.totalCount;
      },
    });
  }

  loadResources() {
    this.resourceService
      .getAll(undefined, undefined, undefined, ResourceStatus.Available, {
        page:1,
        pageSize:10,
      })
      .subscribe({
        next: (result) => {
          this.AvailableResourceCount = result.totalCount;
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
          this.myFutureReservationsCount = result.totalCount;
        },
      });
  }

  protected readonly UserRole = UserRole;
}
