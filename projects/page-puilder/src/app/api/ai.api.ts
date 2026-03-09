import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../core/http/http-client.service';

export interface CreateWebsiteRequest {
  request: string;
  websiteId?: string;
  pageId?: string;
  requestId?: string;
}

export interface CreateWebsiteResponse {
  requestId: string;
  websiteId?: string;
  pageId?: string;
  analysis?: any;
  themes?: any;
  header?: any;
  footer?: any;
  sections?: any[];
  previewNotes?: string;
  questions?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AiApi {
  private http = inject(HttpClientService);

  createWebsite(request: CreateWebsiteRequest): Observable<CreateWebsiteResponse> {
    return this.http.post<CreateWebsiteResponse>('/ai/website/create', request);
  }

  answerWebsiteQuestion(question: string, websiteId?: string, pageId?: string): Observable<{ answer: string }> {
    return this.http.post<{ answer: string }>('/ai/website/question', {
      question,
      websiteId,
      pageId
    });
  }

  getAIRequest(requestId: string): Observable<any> {
    return this.http.get(`/ai/requests/${requestId}`);
  }

  listAIRequests(filters?: {
    websiteId?: string;
    pageId?: string;
    type?: string;
    status?: string;
  }): Observable<any[]> {
    return this.http.get('/ai/requests', { params: filters });
  }
}
