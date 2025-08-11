import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any, headers?: any): Observable<T> {
    return this.http.get<T>(url, {
      params: new HttpParams({ fromObject: params }),
      headers: new HttpHeaders(headers)
    });
  }

  post<T>(url: string, body: any, headers?: any): Observable<T> {
    return this.http.post<T>(url, body, {
      headers: new HttpHeaders(headers)
    });
  }

  put<T>(url: string, body: any, headers?: any): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: new HttpHeaders(headers)
    });
  }

  delete<T>(url: string, params?: any, headers?: any): Observable<T> {
    return this.http.delete<T>(url, {
      params: new HttpParams({ fromObject: params }),
      headers: new HttpHeaders(headers)
    });
  }
}
