import { Component, computed, effect, signal } from '@angular/core';
import { ResourceWithReservations } from '../../../../Shared/Interfaces/Resource/Resource/resource-with-reservations';
import { AuthResponse } from '../../../../Shared/Interfaces/Auth/auth-response';
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/auth-service/auth.service';
import { ResourceService } from '../../../../Core/Services/resource-service/resource.service';
import { ResourceStatus } from '../../../../Shared/Interfaces/Resource/Resource/resource-status';
import { ResourceType } from '../../../../Shared/Interfaces/Resource/Resource/resource-type';
import { ToastrService } from 'ngx-toastr';
import { Guid } from '../../../../Shared/Interfaces/Common/Guid';
import { UserService } from '../../../../Core/Services/user-service/user.service';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-resource-detail-page',
  templateUrl: './resource-detail-page.component.html',
  styleUrl: './resource-detail-page.component.css'
})
export class ResourceDetailPageComponent {
  loading = signal(false);
  resourceId!: number;
  resource!: ResourceWithReservations;
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;

  isModalOpen: boolean = false;

  // filter signals
  reservedByList = signal<string[]>([]);
  taskItemId = signal<string | null>(null);
  startTime = signal<string | null>(null);
  endTime = signal<string | null>(null);

  userFullNames = new Map<Guid, Observable<string | null>>();


  startTimeModel: string | null = null;
  endTimeModel: string | null = null;

  constructor(private readonly router: Router,
              private readonly resourceService: ResourceService,
              private readonly authService: AuthService,
              private readonly route: ActivatedRoute,
              private readonly toastr : ToastrService,
              private readonly userService: UserService,){
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      const filter = this.filterParams();
      queueMicrotask(() => this.loadResource(filter));
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('resourceId');
    if (!id) {
      throw new Error('Missing taskItemId in route');
    }

    this.resourceId = parseInt(id);

    // Set default filter to today for future reservations
    const today = new Date().toISOString().split('T')[0]; // Format: yyyy-MM-dd
    this.setStartTime(today);
    this.startTimeModel = today;

    // Optional: no default end time
    this.setEndTime(null);
    this.endTimeModel = null;

    // Load resource with default filter
    this.loadResource(this.filterParams());
  }

  applyDateFilter() {
    this.setStartTime(this.startTimeModel);
    this.setEndTime(this.endTimeModel);
    this.loadResource(this.filterParams());
  }

  private readonly filterParams = computed<{
    reservedByList?: Guid[];
    taskItemId?: string;
    startTime?: string;
    endTime?: string;
  }>(() => ({
    reservedByList: this.reservedByList().length > 0 ? this.reservedByList() : undefined,
    taskItemId: this.taskItemId() ?? undefined,
    startTime: this.startTime() ?? undefined,
    endTime: this.endTime() ?? undefined
  }));

  loadResource(filters?: {
    reservedByList?: string[];
    taskItemId?: string;
    startTime?: string;
    endTime?: string;
  }) {
    this.loading.set(true);

    this.resourceService.getById(this.resourceId, filters).subscribe({
      next: resource => {
        this.resource = resource;
        this.resource.status = this.mapStatusNumberToEnum(parseInt(resource.status));
        this.resource.type = this.mapTypeNumberToEnum(parseInt(resource.type));
        this.loading.set(false);
      },
      error: (err) => {
        const message = err.message ?? 'Error loading the Resource.';
        this.toastr.error(message);
        this.loading.set(false);
      }
    });
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  GetUserFullName(id: Guid): Observable<string | null> {
    console.log('GetUserFullName', id);
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


  // --- Getters ---
  getReservedByList(): string[] {
    return this.reservedByList();
  }

  getTaskItemId(): string | null {
    return this.taskItemId();
  }

  getStartTime(): string | null {
    return this.startTime();
  }

  getEndTime(): string | null {
    return this.endTime();
  }

// --- Setters ---
  setReservedByList(value: string[]) {
    this.reservedByList.set(value);
  }

  setTaskItemId(value: string | null) {
    this.taskItemId.set(value);
  }

  setStartTime(value: string | null) {
    this.startTime.set(value);
  }

  setEndTime(value: string | null) {
    this.endTime.set(value);
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
