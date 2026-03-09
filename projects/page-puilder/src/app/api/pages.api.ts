import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../core/http/http-client.service';

export interface Page {
  id: string;
  name: string;
  html: string;
  css?: string;
  js?: string;
  websiteId: string;
  order?: number;
  isHomePage?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PagesApi {
  private http = inject(HttpClientService);

  getPages(websiteId?: string): Observable<Page[]> {
    return this.http.get<Page[]>('/pages', { params: websiteId ? { websiteId } : {} });
  }

  getPage(id: string): Observable<Page> {
    return this.http.get<Page>(`/pages/${id}`);
  }

  createPage(data: Partial<Page>): Observable<Page> {
    return this.http.post<Page>('/pages', data);
  }

  updatePage(id: string, data: Partial<Page>): Observable<Page> {
    return this.http.patch<Page>(`/pages/${id}`, data);
  }

  deletePage(id: string): Observable<void> {
    return this.http.delete<void>(`/pages/${id}`);
  }
}
