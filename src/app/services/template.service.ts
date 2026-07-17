import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template.model';
import { getApiUrl } from '../config/api-config';

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private readonly baseUrl = getApiUrl('Template');

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.baseUrl);
  }
}
