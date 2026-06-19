import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resume } from '../models/resume';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'https://localhost:7216/api/Resume'; // Adjust base URL as needed

  constructor(private http: HttpClient) { }

  saveResume(resume: Resume): Observable<any> {
    return this.http.post<any>(this.apiUrl, resume);
  }

  getCurrentUserResume(): Observable<Resume> {
    return this.http.get<Resume>(this.apiUrl);
  }
}
