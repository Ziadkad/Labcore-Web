import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskItem} from "../../../Shared/Interfaces/Project/TaskItem/task-item";
import {UpdateTaskItemInterface} from "../../../Shared/Interfaces/Project/TaskItem/update-task-item-interface";
import {CreateTaskItemInterface} from "../../../Shared/Interfaces/Project/TaskItem/create-task-item-interface";
import {Guid} from "../../../Shared/Interfaces/Common/Guid";
import {TaskItemStatus} from "../../../Shared/Interfaces/Project/TaskItem/task-item-status";

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
  ): Observable<any> {
    const params: any = {};

    if (keyword) params.keyword = keyword;
    if (assignedTo && assignedTo.length > 0) params.assignedTo = assignedTo;
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    if (taskItemStatus !== undefined && taskItemStatus !== null)
      params.taskItemStatus = taskItemStatus;
    if (pageQuery) {
      params["pageQuery.page"] = pageQuery.page;
      params["pageQuery.pageSize"] = pageQuery.pageSize;
    }

    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

}
