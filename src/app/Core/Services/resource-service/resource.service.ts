import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PageQueryResult } from '../../../Shared/Interfaces/Common/page-query-result';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateResourceInterface } from '../../../Shared/Interfaces/Resource/Resource/create-resource-interface';
import { Observable } from 'rxjs';
import { Resource } from '../../../Shared/Interfaces/Resource/Resource/resource';
import { UpdateResourceInterface } from '../../../Shared/Interfaces/Resource/Resource/update-resource-interface';
import { ResourceWithReservations } from '../../../Shared/Interfaces/Resource/Resource/resource-with-reservations';
import { ResourceType } from '../../../Shared/Interfaces/Resource/Resource/resource-type';
import { ResourceStatus } from '../../../Shared/Interfaces/Resource/Resource/resource-status';
import { PageQueryRequest } from '../../../Shared/Interfaces/Common/page-query-request';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private readonly baseUrl = `${environment.apiUrl}/resources/resource`;

  constructor(private http: HttpClient) {
  }

  create(resource: CreateResourceInterface): Observable<Resource> {
    return this.http.post<Resource>(this.baseUrl, resource);
  }

  update(id: number, resource: UpdateResourceInterface): Observable<Resource> {
    return this.http.put<Resource>(`${this.baseUrl}/${id}`, resource);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getById(
    id: number,
    filters?: {
      reservedByList?: string[];
      taskItemId?: string;
      startTime?: string; // ISO format
      endTime?: string;   // ISO format
    }
  ): Observable<ResourceWithReservations> {
    let params = new HttpParams();

    if (filters) {
      if (filters.reservedByList) {
        filters.reservedByList.forEach(guid => {
          params = params.append('reservedByList', guid);
        });
      }
      if (filters.taskItemId) {
        params = params.set('taskItemId', filters.taskItemId);
      }
      if (filters.startTime) {
        params = params.set('startTime', filters.startTime);
      }
      if (filters.endTime) {
        params = params.set('endTime', filters.endTime);
      }
    }

    return this.http.get<ResourceWithReservations>(`${this.baseUrl}/${id}`, { params });
  }


  getAll(
    ids?: number[],
    keyword?: string,
    type?: ResourceType,
    status?: ResourceStatus,
    pageQuery?: PageQueryRequest
  ): Observable<PageQueryResult<Resource>> {
    let params = new HttpParams();

    if (ids && ids.length > 0) {
      ids.forEach(id => {
        params = params.append('ids', id.toString());
      });
    }
    if (keyword) params = params.set('keyword', keyword);
    if (type !== undefined) params = params.set('type', type);
    if (status !== undefined) params = params.set('status', status);
    if (pageQuery) {
      params = params.set('page', pageQuery.page.toString());
      params = params.set('pageSize', pageQuery.pageSize.toString());
    }
    return this.http.get<PageQueryResult<Resource>>(this.baseUrl, { params });
  }
}
