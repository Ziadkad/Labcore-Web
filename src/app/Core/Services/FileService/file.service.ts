import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {UploadFileInterface} from "../../../Shared/Interfaces/File/upload-file-interface";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly baseUrl = `${environment.apiUrl}/files/file`;

  constructor(private http: HttpClient) { }

  uploadFile(data :FormData): Observable<string> {
    return this.http.post(`${this.baseUrl}/Upload`, data, {
      responseType: 'text'
    });
  }

  downloadProjectFile(link :string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${link}`, {
      responseType: 'blob'
    });
  }

  deleteProjectFile(link : string): Observable<any> {
    return this.http.delete(`${this.baseUrl}${link}`);
  }

}
