import { Component, computed, effect, signal } from '@angular/core';
import { User } from '../../../../Shared/Interfaces/User/user';
import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
import { Gender } from '../../../../Shared/Interfaces/Auth/gender';
import { UserService } from '../../../../Core/Services/user-service/user.service';
import { PageQueryRequest } from '../../../../Shared/Interfaces/Common/page-query-request';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users = signal<User[]>([]);
  loading = signal(false);
  keyword = signal('');
  gender = signal<Gender | null>(null);
  role = signal<UserRole|null>(null);
  pageQuery = signal<PageQueryRequest>({ page: 1, pageSize: 10 });
  pageCount!: number;
  totalCount!: number;

  protected readonly UserRole = UserRole;
  protected readonly Gender = Gender;

  constructor(private userService: UserService) {
    effect(() => {
      const filters = this.filterParams();
      queueMicrotask(() => {
        this.loadUsers(filters);
      });
    });
  }

  private readonly filterParams = computed(() => ({
    keyword: this.keyword() || undefined,
    gender: this.gender() ?? undefined,
    roles: this.role() ? [this.role()!] : undefined,
    pageQuery: this.pageQuery(),
  }));

  loadUsers(params: any) {
    this.loading.set(true);
    this.userService.getAllUsers(undefined, params.keyword, params.gender, params.roles, params.pageQuery).subscribe({
      next: result => {
        console.log(result);
        this.users.set(result.items);
        this.totalCount = result.totalCount;
        this.pageCount = Math.ceil(result.totalCount / this.pageQuery().pageSize);
        this.loading.set(false);
      },
      error: err => {
        console.error('Error loading users', err);
        this.loading.set(false);
      }
    });
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.pageCount) {
      this.pageQuery.update(p => ({ ...p, page }));
    }
  }

  isFirstPage(): boolean {
    const current = this.pageQuery();
    return current.page === 1;
  }

  isLastPage(): boolean {
    const current = this.pageQuery();
    return current.page >= this.pageCount;
  }

  // Setters
  setKeyword(value: string): void {
    this.keyword.set(value);
  }

  setGender(value: Gender | null): void {
    this.gender.set(value);
  }

  setRole(value: UserRole): void {
    this.role.set(value);
  }

  getKeyword(): string {
    return this.keyword();
  }

  getGender(): Gender | null {
    return this.gender();
  }

  getRole(): UserRole | null {
    return this.role();
  }

  get userRoleEntries() {
    return Object.keys(UserRole)
      .filter(key => isNaN(Number(key))) // filters out numeric keys like "0", "1", etc.
      .map(key => ({
        key,
        value: UserRole[key as keyof typeof UserRole]
      }));
  }
}
