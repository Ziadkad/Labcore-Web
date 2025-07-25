import { Component, computed, effect, signal } from '@angular/core';
import { ResourceType } from '../../../../Shared/Interfaces/Resource/Resource/resource-type';
import { ResourceStatus } from '../../../../Shared/Interfaces/Resource/Resource/resource-status';
import { AuthResponse } from '../../../../Shared/Interfaces/Auth/auth-response';
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { PageQueryRequest } from '../../../../Shared/Interfaces/Common/page-query-request';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/auth-service/auth.service';
import { ResourceService } from '../../../../Core/Services/resource-service/resource.service';
import { Resource } from '../../../../Shared/Interfaces/Resource/Resource/resource';

@Component({
  selector: 'app-resourcelist-page',
  templateUrl: './resourcelist-page.component.html',
  styleUrl: './resourcelist-page.component.css'
})
export class ResourcelistPageComponent {
  loading = signal(false);
  resourceList= signal<Resource[]>([]);
  keyword = signal<string>('');
  type = signal<ResourceType | null>(null);
  status = signal<ResourceStatus | null>(null);
  currentUser: AuthResponse | null = null;
  userRole: UserRole | undefined;
  pageQuery = signal<PageQueryRequest>({ page: 1, pageSize: 10 });
  pageCount! : number;

  constructor(private readonly router: Router,
              private readonly resourceService: ResourceService ,
              private readonly authService: AuthService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
      const params = this.filterParams(); // just track dependencies
      queueMicrotask(() => this.loadResources(params));// async outside effect
    });
  }
  private readonly filterParams = computed<{
    ids?: number[] | null;
    keyword?: string;
    type?: ResourceType;
    status?: ResourceStatus;
    pageQuery: PageQueryRequest;
  }>(() => ({
    ids : null,
    keyword: this.keyword() || undefined,
    type: this.type() || undefined,
    status: this.status() || undefined,
    pageQuery: this.pageQuery(),
  }));

  loadResources(params:any) {
    this.loading.set(true);
    console.log("called");
    this.resourceService.getAll(  params.ids ?? undefined,
      params.keyword,
      params.type,
      params.status,
      params.pageQuery).subscribe({
      next: result => {
        const items = result.items.map((item: Resource) => ({
          ...item,
          type : this.mapTypeNumberToEnum(parseInt(item.type)),
          status: this.mapStatusNumberToEnum(parseInt(item.status)),
        }));
        this.resourceList.set(items);
        this.getTotalPage(result.totalCount);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
  getTotalPage(total : number): void {
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

  goToAddResource(){
    this.router.navigate(['/createresource']);
  }


  // public getters
  getKeyword(): string {
    return this.keyword();
  }

  getType(): ResourceType | null {
    return this.type();
  }

  getStatus(): ResourceStatus | null {
    return this.status();
  }

  // public setters
  setKeyword(value: string) {
    this.keyword.set(value);
  }

  setType(value: ResourceType | null) {
    this.type.set(value);
  }

  setStatus(value: ResourceStatus | null) {
    this.status.set(value);
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
  protected readonly ResourceStatus = ResourceStatus;
  protected readonly ResourceType = ResourceType;
  protected readonly UserRole = UserRole;
}
