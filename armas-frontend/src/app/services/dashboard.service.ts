import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResumoDashboard } from '../models/dashboard.model';
import { API } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private http = inject(HttpClient);

  resumo(): Observable<ResumoDashboard> {
    return this.http.get<ResumoDashboard>(`${API}/dashboard/resumo`);
  }
}
