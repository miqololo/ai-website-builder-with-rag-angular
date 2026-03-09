import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlerService, AppError } from '../errors/error-handler.service';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: any };
  observe?: 'body';
  reportProgress?: boolean;
  responseType?: 'json';
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly baseUrl = environment.apiUrl;
  private errorHandler = inject(ErrorHandlerService);
  private http = inject(HttpClient);

  /**
   * GET request
   */
  get<T>(url: string, options?: HttpOptions): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.get<T>(this.buildUrl(url), httpOptions).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ) as Observable<T>;
  }

  /**
   * POST request
   */
  post<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.post<T>(this.buildUrl(url), body, httpOptions).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ) as Observable<T>;
  }

  /**
   * PUT request
   */
  put<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.put<T>(this.buildUrl(url), body, httpOptions).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ) as Observable<T>;
  }

  /**
   * PATCH request
   */
  patch<T>(url: string, body: any, options?: HttpOptions): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.patch<T>(this.buildUrl(url), body, httpOptions).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ) as Observable<T>;
  }

  /**
   * DELETE request
   */
  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.delete<T>(this.buildUrl(url), httpOptions).pipe(
      catchError(error => this.errorHandler.handleError(error))
    ) as Observable<T>;
  }

  /**
   * Build full URL
   */
  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  }

  /**
   * Build request options with auth headers
   */
  private buildOptions(options?: HttpOptions): {
    headers?: HttpHeaders;
    params?: HttpParams | { [param: string]: any };
    observe: 'body';
    responseType: 'json';
    reportProgress?: boolean;
    context?: HttpContext;
  } {
    const defaultHeaders: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available (get directly from localStorage to avoid circular dependency)
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const httpOptions: {
      headers?: HttpHeaders;
      params?: HttpParams | { [param: string]: any };
      observe: 'body';
      responseType: 'json';
      reportProgress?: boolean;
      context?: HttpContext;
    } = {
      observe: 'body' as const,
      responseType: 'json' as const,
    };

    // Set headers
    if (options?.headers) {
      httpOptions.headers = new HttpHeaders({ ...defaultHeaders, ...this.headersToObject(options.headers) });
    } else {
      httpOptions.headers = new HttpHeaders(defaultHeaders);
    }

    // Set params if provided
    if (options?.params) {
      httpOptions.params = options.params;
    }

    // Set reportProgress if provided
    if (options?.reportProgress !== undefined) {
      httpOptions.reportProgress = options.reportProgress;
    }

    return httpOptions;
  }

  /**
   * Convert HttpHeaders to object
   */
  private headersToObject(headers: HttpHeaders | { [key: string]: string | string[] }): { [key: string]: string | string[] } {
    if (headers instanceof HttpHeaders) {
      const result: { [key: string]: string | string[] } = {};
      headers.keys().forEach(key => {
        const value = headers.get(key);
        if (value) {
          result[key] = value;
        }
      });
      return result;
    }
    return headers;
  }
}
