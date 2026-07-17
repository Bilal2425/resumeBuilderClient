import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ResumeData } from '../models/resume.model';

import { getApiUrl } from '../config/api-config';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private readonly baseUrl = getApiUrl('Resume');

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  saveResume(resume: ResumeData): Observable<any> {
    return this.http.post(`${this.baseUrl}/Resume`, resume, {
      headers: this.getAuthHeaders()
    });
  }

  getResume(): Observable<ResumeData> {
    return this.http.get<ResumeData>(`${this.baseUrl}/Resume`, {
      headers: this.getAuthHeaders()
    });
  }

  /** @deprecated Use getResume() instead */
  getCurrentUserResume(): Observable<ResumeData> {
    return this.getResume();
  }

  generatePdf(): Observable<Blob> {
    const token = this.authService.getToken();
    return this.http.post(`${this.baseUrl}/GenerateResume`, {}, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }),
      responseType: 'blob'
    });
  }
}
