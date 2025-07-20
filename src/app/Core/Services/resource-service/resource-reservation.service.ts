import { Injectable } from '@angular/core';
import { PageQueryResult } from '../../../Shared/Interfaces/Common/page-query-result';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResourceReservation } from '../../../Shared/Interfaces/Resource/ResourceReservation/resource-reservation';
import { Observable } from 'rxjs';
import {
  CreateResourceReservationInterface
} from '../../../Shared/Interfaces/Resource/ResourceReservation/create-resource-reservation-interface';
import { PageQueryRequest } from '../../../Shared/Interfaces/Common/page-query-request';
import {
  ResourceReservationWithResource
} from '../../../Shared/Interfaces/Resource/ResourceReservation/resource-reservation-with-resource';

@Injectable({
  providedIn: 'root'
})
export class ResourceReservationService {

  private readonly baseUrl = `${environment.apiUrl}/resources/resourcereservation`;

  constructor(private http: HttpClient) {}

  createReservation(reservation:  CreateResourceReservationInterface): Observable<ResourceReservation> {
    return this.http.post<ResourceReservation>(this.baseUrl, reservation);
  }

  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getReservations(
    ids?: number[],
    resourceId?: number,
    reservedBy?: string,
    taskItemId?: string,
    startTime?: Date,
    endTime?: Date,
    pageQuery?: PageQueryRequest
  ): Observable<PageQueryResult<ResourceReservationWithResource>> {
    let params = new HttpParams();

    if (ids?.length) {
      ids.forEach(id => {
        params = params.append('ids', id.toString());
      });
    }
    if (resourceId !== undefined) params = params.set('resourceId', resourceId.toString());
    if (reservedBy) params = params.set('reservedBy', reservedBy);
    if (taskItemId) params = params.set('taskItemId', taskItemId);
    if (startTime) params = params.set('startTime', startTime.toISOString());
    if (endTime) params = params.set('endTime', endTime.toISOString());
    if (pageQuery) {
      params = params.set('page', pageQuery.page.toString());
      params = params.set('pageSize', pageQuery.pageSize.toString());
    }

    return this.http.get<PageQueryResult<ResourceReservationWithResource>>(this.baseUrl, { params });
  }
}
