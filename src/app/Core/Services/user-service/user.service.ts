import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Guid} from "../../../Shared/Interfaces/Common/Guid";
import {Gender} from "../../../Shared/Interfaces/Auth/gender";
import {UserRole} from "../../../Shared/Interfaces/Auth/user-role";
import {PageQueryRequest} from "../../../Shared/Interfaces/Common/page-query-request";
import {PageQueryResult} from "../../../Shared/Interfaces/Common/page-query-result";
import {User} from "../../../Shared/Interfaces/User/user";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/auth/User`;

  constructor(private http: HttpClient) {}
  getAllUsers(
    ids?: Guid[],
    keyword?: string,
    gender?: Gender,
    roles?: UserRole[],
    pageQuery?: PageQueryRequest
  ): Observable<PageQueryResult<User>> {
    let params = new HttpParams();

    if (ids && ids.length) {
      ids.forEach(id => {
        params = params.append('ids', id);
      });
    }

    if (keyword) {
      params = params.set('keyword', keyword);
    }

    if (gender !== undefined && gender !== null) {
      params = params.set('gender', gender);
    }

    if (roles && roles.length) {
      roles.forEach(role => {
        params = params.append('roles', role);
      });
    }

    if (pageQuery) {
      params = params.set('pageQuery.page', pageQuery.page.toString());
      params = params.set('pageQuery.pageSize', pageQuery.pageSize.toString());
    }

    return this.http.get<PageQueryResult<User>>(this.baseUrl, { params });
  }

}
