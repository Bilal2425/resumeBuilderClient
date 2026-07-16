import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template.model';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly baseUrl = 'https://localhost:7216/api/Template';

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.baseUrl);
  }
}
