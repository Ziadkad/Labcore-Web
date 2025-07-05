import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Study} from "../../../Shared/Interfaces/Project/Study/study";
import {UpdateStudyInterface} from "../../../Shared/Interfaces/Project/Study/update-study-interface";
import {StudyWithTaskItems} from "../../../Shared/Interfaces/Project/Study/study-with-task-items";
import {CreateStudyInterface} from "../../../Shared/Interfaces/Project/Study/create-study-interface";
import {environment} from "../../../../environments/environment";
import {Guid} from "../../../Shared/Interfaces/Common/Guid";
import {PageQueryRequest} from "../../../Shared/Interfaces/Common/page-query-request";

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  private readonly baseUrl = `${environment.apiUrl}/projects/study`;

  constructor(private http: HttpClient) {}
  getStudy(id: Guid): Observable<Study> {
    return this.http.get<Study>(`${this.baseUrl}/${id}`);
  }

  createStudy(data: CreateStudyInterface): Observable<Study> {
    return this.http.post<Study>(this.baseUrl, data);
  }

  getStudyWithTaskItems(
    id: Guid,
    options?: {
      keyword?: string;
      assignedTo?: string[];
      startDate?: string;
      endDate?: string;
      taskItemStatus?: string;
      pageQueryRequest: PageQueryRequest;
    }
  ): Observable<StudyWithTaskItems> {
    let params = new HttpParams();

    if (options?.keyword) params = params.set('keyword', options.keyword);
    if (options?.assignedTo) {
      options.assignedTo.forEach(val => {
        params = params.append('assignedTo', val);
      });
    }
    if (options?.startDate) params = params.set('startDate', options.startDate);
    if (options?.endDate) params = params.set('endDate', options.endDate);
    if (options?.taskItemStatus) params = params.set('taskItemStatus', options.taskItemStatus);

    // Unpack pageQueryRequest into nested parameters (e.g., pageQuery.page)
    const pq = options?.pageQueryRequest;
    if (pq) {
      params = params.set('pageQuery.page', pq.page.toString());
      params = params.set('pageQuery.pageSize', pq.pageSize.toString());
      if (pq.sortColumn) params = params.set('pageQuery.sortColumn', pq.sortColumn);
      if (pq.sortAscending !== undefined) {
        params = params.set('pageQuery.sortAscending', pq.sortAscending.toString());
      }
    }

    return this.http.get<StudyWithTaskItems>(`${this.baseUrl}/TaskItems/${id}`, { params });
  }


  updateStudy(id: Guid, data: UpdateStudyInterface): Observable<Study> {
    return this.http.put<Study>(`${this.baseUrl}/${id}`, data);
  }

  deleteStudy(id: Guid): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getStudyResult(id: Guid): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/StudyResult/${id}`);
  }
}
