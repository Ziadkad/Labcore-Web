import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from "rxjs";
import {TaskItem} from "../../../Shared/Interfaces/Project/TaskItem/task-item";
import {UpdateTaskItemInterface} from "../../../Shared/Interfaces/Project/TaskItem/update-task-item-interface";
import {CreateTaskItemInterface} from "../../../Shared/Interfaces/Project/TaskItem/create-task-item-interface";
import {Guid} from "../../../Shared/Interfaces/Common/Guid";
import {TaskItemStatus} from "../../../Shared/Interfaces/Project/TaskItem/task-item-status";
import { PageQueryResult } from '../../../Shared/Interfaces/Common/page-query-result';

@Injectable({
  providedIn: 'root'
})
export class TaskItemService {
  private readonly baseUrl = `${environment.apiUrl}/projects/taskitem`;
  constructor(private http: HttpClient) {}

  getTaskItem(id: Guid): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.baseUrl}/${id}`);
  }

  createTaskItem(data: CreateTaskItemInterface): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.baseUrl, data);
  }

  updateTaskItem(id: Guid, data: UpdateTaskItemInterface): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.baseUrl}/${id}`, data);
  }

  updateTaskItemStatus(id: Guid, status : TaskItemStatus): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.baseUrl}/status/${id}`, {id: id, status: status});
  }

  deleteTaskItem(id: Guid): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getFilteredTaskItems(
    keyword?: string,
    assignedTo?: Guid[],
    startDate?: Date,
    endDate?: Date,
    taskItemStatus?: TaskItemStatus,
    pageQuery?: { page: number; pageSize: number }
  ): Observable<PageQueryResult<TaskItem>> {
    let params = new HttpParams();

    if (keyword) params = params.set('keyword', keyword);
    if (assignedTo && assignedTo.length > 0) {
      assignedTo.forEach(id => {
        params = params.append('assignedTo', id);
      });
    }
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    if (taskItemStatus !== undefined && taskItemStatus !== null)
      params = params.set('taskItemStatus', taskItemStatus.toString());
    if (pageQuery) {
      params = params.set('page', pageQuery.page.toString());
      params = params.set('pageSize', pageQuery.pageSize.toString());
    }
    return this.http.get<PageQueryResult<TaskItem>>(`${this.baseUrl}`, { params });
  }


}
