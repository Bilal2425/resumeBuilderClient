import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ResumeData } from '../models/resume.model';
import { getApiUrl } from '../config/api-config';

@Injectable({ providedIn: 'root' })
export class ResumeParserService {
  private readonly baseUrl = getApiUrl('ResumeParser');

  constructor(private http: HttpClient, private authService: AuthService) {}

  parseResume(file: File): Observable<ResumeData> {
    const token = this.authService.getToken();
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<ResumeData>(`${this.baseUrl}/upload`, formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    });
  }
}
