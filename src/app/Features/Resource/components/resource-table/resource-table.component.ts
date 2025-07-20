import { Component, effect, Input, OnInit } from '@angular/core';
import { Resource } from '../../../../Shared/Interfaces/Resource/Resource/resource';
import { AuthResponse } from '../../../../Shared/Interfaces/Auth/auth-response';
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { AuthService } from '../../../../Core/Services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ResourceService } from '../../../../Core/Services/resource-service/resource.service';
import { ToastrService } from 'ngx-toastr';
import { ResourceStatus } from '../../../../Shared/Interfaces/Resource/Resource/resource-status';
import { ResourceType } from '../../../../Shared/Interfaces/Resource/Resource/resource-type';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrl: './resource-table.component.css',
})
export class ResourceTableComponent implements OnInit {
  @Input() resources: Resource[] = [];
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly resourceService: ResourceService,
    private readonly toastr: ToastrService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
    });
  }

  ngOnInit(): void {
    this.resources = this.resources?.map(item => ({
      ...item,
      status : this.mapStatusNumberToEnum(parseInt(item.status)),
      type: this.mapTypeNumberToEnum(parseInt(item.type))
    }));
  }

  onViewDetails(id: number) {
    this.router.navigate([`/resource`, id]);
  }

  onUpdate(id: number) {
    this.router.navigate(['/editresource', id]);
  }

  onDelete(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this resource?');
    if (!confirmed) return;
    this.resourceService.delete(id).subscribe({
      next: () => {
        this.toastr.success('resource deleted successfully');
        this.router.navigate(['/resources']);
      },
      error: (err) => {
        const message = err.message ?? 'An error occurred while deleting the file.';
        this.toastr.error(message);
      },
    });
  }

  mapStatusNumberToEnum(value: number): ResourceStatus {
    const map: { [key: number]: ResourceStatus } = {
      0: ResourceStatus.Available,
      2: ResourceStatus.Unavailable,
      1: ResourceStatus.UnderMaintenance,
    };
    return map[value];
  }

  mapTypeNumberToEnum(value: number): ResourceType {
    const map: { [key: number]: ResourceType } = {
      0: ResourceType.Consumable,
      1: ResourceType.Room,
      2: ResourceType.Tool,
      3: ResourceType.Other
    };
    return map[value];
  }

  protected readonly UserRole = UserRole;
}
