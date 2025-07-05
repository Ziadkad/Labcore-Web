import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {StudyResult} from "../../../Shared/Interfaces/Project/StudyResult/study-result";
import {CreateStudyResultInterface} from "../../../Shared/Interfaces/Project/StudyResult/create-study-result-interface";
import {UpdateStudyResultInterface} from "../../../Shared/Interfaces/Project/StudyResult/update-study-result-interface";
import {HttpClient} from "@angular/common/http";
import {Guid} from "../../../Shared/Interfaces/Common/Guid";

@Injectable({
  providedIn: 'root'
})
export class StudyResultService {
  private readonly baseUrl = `${environment.apiUrl}/projects/studyresult`;

  constructor(private http: HttpClient) {}

  createStudyResult(data: CreateStudyResultInterface): Observable<StudyResult> {
    return this.http.post<StudyResult>(this.baseUrl, data);
  }

  updateStudyResult(id: Guid, data: UpdateStudyResultInterface): Observable<StudyResult> {
    return this.http.put<StudyResult>(`${this.baseUrl}/${id}`, data);
  }

  deleteStudyResult(id: Guid): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
