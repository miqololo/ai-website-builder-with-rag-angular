import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GenerateRequest {
  prompt: string;
  type?: 'html' | 'js' | 'both';
}

export interface StreamEvent {
  type: 'connected' | 'content' | 'update' | 'done' | 'error';
  data?: string;
  html?: string | null;
  js?: string | null;
  raw?: string;
  error?: string;
}

export interface GenerateAndApplyRequest extends GenerateRequest {
  projectId?: string;
  pageId: string;
}

export interface TestResponse {
  status: string;
  message: string;
  timestamp: string;
  authenticated: boolean;
}

export interface ComponentSuggestionRequest {
  existingComponents?: Array<{
    name: string;
    category?: string;
    description?: string;
  }>;
  projectType?: string;
  specificNeeds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiGeneratorService {
  private readonly apiUrl = environment.apiUrl;
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly authToken = 'world'; // Should be configurable via environment

  constructor(private http: HttpClient) {}

  /**
   * Generate HTML and/or JavaScript content using Claude AI
   * Returns an Observable that streams the response chunks
   */
  generateCode(request: GenerateRequest): Observable<StreamEvent> {
    const subject = new Subject<StreamEvent>();

    const headers = new HttpHeaders({
      'x-auth-token': this.authToken,
      'Content-Type': 'application/json'
    });

    // Note: EventSource doesn't support custom headers for POST requests
    // We need to use fetch API instead for SSE with authentication
    this.streamWithFetch(request, headers, subject, '/generate');

    return subject.asObservable();
  }

  /**
   * Test the API connection and authentication
   */
  testConnection(): Observable<TestResponse> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken
    });

    return this.http.get<TestResponse>(`${this.apiUrl}/test`, { headers });
  }

  /**
   * Check backend health status
   */
  checkHealth(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.apiBaseUrl}/health`);
  }

  /**
   * Set authentication token (for dynamic configuration)
   */
  setAuthToken(token: string): void {
    (this as any).authToken = token;
  }

  /**
   * Get current authentication token
   */
  getAuthToken(): string {
    return this.authToken;
  }

  /**
   * Generate code and apply it to a page in real-time
   * Streams updates and applies them to the page as they arrive
   */
  generateAndApply(request: GenerateAndApplyRequest): Observable<StreamEvent> {
    const subject = new Subject<StreamEvent>();

    this.streamWithFetch(
      {
        prompt: request.prompt,
        type: request.type,
        projectId: request.projectId,
        pageId: request.pageId,
      },
      new HttpHeaders({
        'x-auth-token': this.authToken,
        'Content-Type': 'application/json'
      }),
      subject,
      '/generate-and-apply'
    );

    return subject.asObservable();
  }

  /**
   * Stream using fetch API to support POST requests with custom headers
   */
  private async streamWithFetch(
    request: GenerateRequest & { projectId?: string; pageId?: string },
    headers: HttpHeaders,
    subject: Subject<StreamEvent>,
    endpoint: string = '/generate'
  ): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'x-auth-token': this.authToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        subject.error(new Error(error.error || `HTTP ${response.status}`));
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        subject.error(new Error('No response body'));
        return;
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              subject.next(data);

              if (data.type === 'done' || data.type === 'error') {
                subject.complete();
                return;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      subject.complete();
    } catch (error) {
      subject.error(error);
    }
  }

  /**
   * Get component suggestions from AI
   * Accepts existing components and returns AI-generated suggestions
   */
  getComponentSuggestions(request: ComponentSuggestionRequest): Observable<StreamEvent> {
    const subject = new Subject<StreamEvent>();

    this.streamWithFetch(
      request as any,
      new HttpHeaders({
        'x-auth-token': this.authToken,
        'Content-Type': 'application/json'
      }),
      subject,
      '/generate/component-suggestions'
    );

    return subject.asObservable();
  }

  /**
   * Get the generated prompt for component suggestions (without calling AI)
   * Useful for debugging or previewing the prompt
   */
  getComponentPrompt(request: ComponentSuggestionRequest): Observable<{ prompt: string }> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken
    });

    const params: any = {
      projectType: request.projectType || 'general website'
    };

    if (request.existingComponents && request.existingComponents.length > 0) {
      params.existingComponents = JSON.stringify(request.existingComponents);
    }

    if (request.specificNeeds && request.specificNeeds.length > 0) {
      params.specificNeeds = request.specificNeeds;
    }

    const queryString = new URLSearchParams(params).toString();
    return this.http.get<{ prompt: string }>(`${this.apiUrl}/generate/component-prompt?${queryString}`, { headers });
  }

  /**
   * Set API URL (for different environments)
   */
  setApiUrl(url: string): void {
    (this as any).apiUrl = url;
  }
}
