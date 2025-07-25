import {Component, computed, effect, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {PageQueryResult} from "../../../../Shared/Interfaces/Common/page-query-result";
import {Project} from "../../../../Shared/Interfaces/Project/Project/project";
import {ProjectStatus} from "../../../../Shared/Interfaces/Project/Project/project-status";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {PageQueryRequest} from "../../../../Shared/Interfaces/Common/page-query-request";
import {UserService} from "../../../../Core/Services/user-service/user.service";
import {User} from "../../../../Shared/Interfaces/User/user";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {Options} from "@angular-slider/ngx-slider";


@Component({
  selector: 'app-project-list-page',
  templateUrl: './project-list-page.component.html',
  styleUrl: './project-list-page.component.css'
})
export class ProjectListPageComponent implements OnInit{
  loading = signal(false);
  error = signal<string | null>(null);
  projects = signal<PageQueryResult<Project> | null>(null);
  managerList: User[] = [];
  researcherList: User[] = [];
  keyword = signal('');
  startDate = signal<Date | null>(null);
  endDate = signal<Date | null>(null);
  status = signal<ProjectStatus | null>(null);
  progressPercentageMin = signal<number>(0);
  progressPercentageMax = signal<number>(100);
  tags = signal<string[]>([]);
  researchers = signal<Guid[]>([]);
  manager = signal<Guid | null>(null);
  pageQuery = signal<PageQueryRequest>({ page: 1, pageSize: 9 });

  pageCount! : number;

  constructor(
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
  ) {
      effect(() => {
        const params = this.filterParams(); // just track dependencies
        queueMicrotask(() => this.loadProjects(params)); // async outside effect
      });
  }

  ngOnInit() {
    this.loadManagers();
    this.loadResearcher();
  }
  private readonly filterParams = computed(() => ({
    keyword: this.keyword() ?? undefined,
    startDate: this.startDate() ?? undefined,
    endDate: this.endDate() ?? undefined,
    status: this.status() ?? undefined,
    progressPercentageMin: this.progressPercentageMin() ?? undefined,
    progressPercentageMax: this.progressPercentageMax() ?? undefined,
    tags: this.tags().length ? this.tags() : undefined,
    researchers: this.researchers().length ? this.researchers() : undefined,
    manager: this.manager() ?? undefined,
    pageQuery: this.pageQuery(),
  }));

  loadProjects(params : any) {
    this.loading.set(true);
    this.error.set(null);

    this.projectService.getAllProjects(params).subscribe({
      next: result => {
        this.projects.set(result);
        this.getTotalPage();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load projects');
        this.loading.set(false);
      }
    });
  }

  loadManagers(){
    this.userService.getAllUsers(  undefined,
      undefined,
      undefined,
      [UserRole.Manager], { page: 1, pageSize: 500 }).subscribe(data=>{
      this.managerList = data.items;
    })
  }
  loadResearcher(){
    this.userService.getAllUsers(  undefined,
      undefined,
      undefined,
      [UserRole.Researcher], { page: 1, pageSize: 500 }).subscribe(data=>{
      this.researcherList = data.items;
    })
  }

  getTotalPage(): void {
    const total = this.projects()?.totalCount ?? 0;
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






  get keywordValue(): string {
    return this.keyword();
  }
  set keywordValue(value: string) {
    this.keyword.set(value);
  }

  get startDateValue(): Date | null {
    return this.startDate();
  }
  set startDateValue(value: Date | null) {
    this.startDate.set(value);
  }

  get endDateValue(): Date | null {
    return this.endDate();
  }
  set endDateValue(value: Date | null) {
    this.endDate.set(value);
  }

  get statusValue(): ProjectStatus | null {
    return this.status();
  }
  set statusValue(value: ProjectStatus | null) {
    this.status.set(value);
  }

  get progressPercentageMinValue(): number {
    return this.progressPercentageMin();
  }
  set progressPercentageMinValue(value: number) {
    this.progressPercentageMin.set(value);
  }

  get progressPercentageMaxValue(): number{
    return this.progressPercentageMax();
  }
  set progressPercentageMaxValue(value: number) {
    this.progressPercentageMax.set(value);
  }

  get tagsValue(): string[] {
    return this.tags();
  }
  set tagsValue(value: string[]) {
    this.tags.set(value);
  }

  get researchersValue(): Guid[] {
    return this.researchers();
  }
  set researchersValue(value: Guid[]) {
    this.researchers.set(value);
  }

  get managerValue(): Guid | null {
    return this.manager();
  }
  set managerValue(value: Guid | null) {
    this.manager.set(value);
  }
  sliderOptions: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    translate: (value: number): string => `${value}%`
  };

  statusOptions = Object.values(ProjectStatus);
}
