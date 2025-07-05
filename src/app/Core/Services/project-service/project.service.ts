import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Guid} from "../../../Shared/Interfaces/Common/Guid";
import {Observable} from "rxjs";
import {Project} from "../../../Shared/Interfaces/Project/Project/project";
import {UpdateProjectInterface} from "../../../Shared/Interfaces/Project/Project/update-project-interface";
import {CreateProjectInterface} from "../../../Shared/Interfaces/Project/Project/create-project-interface";
import {ProjectStatus} from "../../../Shared/Interfaces/Project/Project/project-status";
import {PageQueryResult} from "../../../Shared/Interfaces/Common/page-query-result";
import {PageQueryRequest} from "../../../Shared/Interfaces/Common/page-query-request";
import {ProjectWithStudies} from "../../../Shared/Interfaces/Project/Project/project-with-studies";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly baseUrl = `${environment.apiUrl}/projects/project`;
  constructor(
    private readonly http: HttpClient
  ) { }
  getProjectById(id: Guid): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  getProjectWithStudies(id: Guid): Observable<ProjectWithStudies> {
    return this.http.get<ProjectWithStudies>(`${this.baseUrl}/Studies/${id}`);
  }
  getAllProjects(params: {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    status?: ProjectStatus;
    progressPercentageMin?: number;
    progressPercentageMax?: number;
    tags?: string[];
    researchers?: Guid[];
    manager?: Guid;
    pageQuery?: PageQueryRequest;
  }): Observable<PageQueryResult<Project>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
    if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
    if (params.status !== undefined) httpParams = httpParams.set('status', params.status.toString());
    if (params.progressPercentageMin !== undefined) httpParams = httpParams.set('progressPercentageMin', params.progressPercentageMin.toString());
    if (params.progressPercentageMax !== undefined) httpParams = httpParams.set('progressPercentageMax', params.progressPercentageMax.toString());
    if (params.tags) params.tags.forEach(tag => httpParams = httpParams.append('tags', tag));
    if (params.researchers) params.researchers.forEach(r => httpParams = httpParams.append('researchers', r));
    if (params.manager) httpParams = httpParams.set('manager', params.manager);
    if (params.pageQuery) {
      httpParams = httpParams.set('pageQuery.page', params.pageQuery.page.toString());
      httpParams = httpParams.set('pageQuery.pageSize', params.pageQuery.pageSize.toString());
    }
    return this.http.get<PageQueryResult<Project>>(this.baseUrl, { params: httpParams });
  }

  createProject(project: CreateProjectInterface): Observable<Project> {
    return this.http.post<Project>(this.baseUrl, project);
  }

  updateProject(data: UpdateProjectInterface): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/${data.id}`, data);
  }
  addResearchersToProject(projectId: Guid, researcherIds: Guid[]): Observable<Project> {
    return this.http.put<Project>(`${this.baseUrl}/AddResearchers/${projectId}`, researcherIds);
  }
  deleteProject(id: Guid): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
