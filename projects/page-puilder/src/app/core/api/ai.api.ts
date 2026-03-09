import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClientService } from '../http/http-client.service';
import { environment } from '../../../environments/environment';

export interface CreateWebsiteRequest {
  request: string;
  websiteId?: string;
  pageId?: string;
  requestId?: string;
}

export interface CreateWebsiteResponse {
  requestId: string;
  status: string;
  message?: string;
  sseUrl?: string;
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

export interface SSEEvent {
  type: string;
  data: any;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiApi {
  private http = inject(HttpClientService);

  createWebsite(request: CreateWebsiteRequest): Observable<CreateWebsiteResponse> {
    return this.http.post<CreateWebsiteResponse>('/ai/website/create-v2', request);
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

  /**
   * Connect to SSE stream for website creation progress
   */
  streamWebsiteCreation(requestId: string): Observable<SSEEvent> {
    const subject = new Subject<SSEEvent>();
    const baseUrl = environment.apiUrl;
    const sseUrl = `${baseUrl}/ai/website/create-v2/stream/${requestId}`;

    const eventSource = new EventSource(sseUrl, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        subject.next({
          type: data.type,
          data: data,
          id: event.lastEventId,
        });
      } catch (error) {
        console.error('Error parsing SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      subject.error(error);
      eventSource.close();
    };

    // Cleanup on unsubscribe
    return new Observable((observer) => {
      const subscription = subject.subscribe(observer);
      return () => {
        eventSource.close();
        subscription.unsubscribe();
      };
    });
  }
}
