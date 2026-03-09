import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Page } from '../models/builder.models';
import { BackendPageData, PageData } from '../models/page-renderer.model';
import { environment } from '../../../environments/environment';

export interface BackendPage {
  _id: string;
  projectId: string;
  name: string;
  html: string;
  css?: string;
  js?: string;
  metadata?: any;
  order?: number;
  isHomePage?: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private readonly apiUrl = environment.apiUrl;
  private readonly authToken = 'world';

  constructor(private http: HttpClient) {}

  /**
   * Get all pages for a project (uses default project if not provided)
   */
  getPages(projectId?: string): Observable<Page[]> {
    const url = projectId 
      ? `${this.apiUrl}/pages/project/${projectId}`
      : `${this.apiUrl}/pages/project`; // Backend will use default project
    
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken
    });

    return this.http.get<BackendPage[]>(url, { headers }).pipe(
      map(pages => pages.map(page => this.mapBackendPageToFrontend(page)))
    );
  }

  /**
   * Get a single page by ID
   */
  getPageById(id: string): Observable<Page> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken
    });

    return this.http.get<BackendPage>(`${this.apiUrl}/pages/${id}`, { headers }).pipe(
      map(page => this.mapBackendPageToFrontend(page))
    );
  }

  /**
   * Get a single page by slug
   */
  getPageBySlug(slug: string): Observable<Page> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken
    });

    return this.http.get<BackendPage>(`${this.apiUrl}/pages/slug/${slug}`, { headers }).pipe(
      map(page => this.mapBackendPageToFrontend(page))
    );
  }

  /**
   * Get page data by slug (structured data)
   * For testing: loads from example JSON file
   */
  getPageDataBySlug(slug: string): Observable<PageData> {
    // For testing: load from example JSON file
    return this.http.get<BackendPageData>('/assets/examples/example-page.json').pipe(
      map(page => this.mapBackendPageDataToFrontend(page)),
      catchError(error => {
        console.warn('Failed to load example page, using fallback:', error);
        // Fallback to default page structure
        return of(this.getDefaultPageData(slug));
      })
    );
  }

  /**
   * Get default page data structure
   */
  private getDefaultPageData(slug: string): PageData {
    return {
      id: 'default-page',
      name: 'Default Page',
      slug: slug,
      layout: 'one',
      sections: [
        {
          id: 'default-section',
          component: 'container',
          className: 'py-16',
          enableContainer: true,
          enableSectionSpacing: true,
          py: 64,
          px: 0,
          data: {
            className: 'container mx-auto px-4'
          },
          children: [
            {
              id: 'default-content',
              component: 'text',
              data: {
                content: '<h1 class="text-4xl font-bold mb-4">Welcome</h1><p class="text-lg">This is a default page structure.</p>'
              }
            }
          ]
        }
      ],
      css: '',
      js: '',
      metadata: {
        title: 'Default Page',
        description: 'Default page description',
        keywords: 'default, page'
      },
      createdAt: new Date()
    };
  }

  /**
   * Map backend page data to frontend PageData format
   */
  private mapBackendPageDataToFrontend(backendPage: BackendPageData): PageData {
    // If page has structured data, use it
    if (backendPage.data) {
      return {
        ...backendPage.data,
        id: backendPage._id,
        createdAt: new Date(backendPage.createdAt)
      };
    }

    // Otherwise, create default structure from HTML
    return {
      id: backendPage._id,
      name: backendPage.name,
      slug: backendPage.slug || backendPage.name.toLowerCase().replace(/\s+/g, '-'),
      layout: 'one',
      sections: [
        {
          id: 'main-content',
          component: 'container',
          data: {
            content: backendPage.html || '<div>No content</div>'
          }
        }
      ],
      css: backendPage.css,
      js: backendPage.js,
      metadata: backendPage.metadata,
      createdAt: new Date(backendPage.createdAt)
    };
  }

  /**
   * Create a new page
   */
  createPage(page: Partial<Page>, projectId?: string): Observable<Page> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken,
      'Content-Type': 'application/json'
    });

    const body = {
      ...page,
      projectId: projectId || undefined, // Backend will use default project
      html: page.html || '<div class="page-container"><h1>New Page</h1></div>',
      css: page.css || '',
    };

    return this.http.post<BackendPage>(`${this.apiUrl}/pages`, body, { headers }).pipe(
      map(page => this.mapBackendPageToFrontend(page))
    );
  }

  /**
   * Update a page
   */
  updatePage(id: string, updates: Partial<Page>): Observable<Page> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken,
      'Content-Type': 'application/json'
    });

    return this.http.put<BackendPage>(`${this.apiUrl}/pages/${id}`, updates, { headers }).pipe(
      map(page => this.mapBackendPageToFrontend(page))
    );
  }

  /**
   * Delete a page
   */
  deletePage(id: string): Observable<void> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken
    });

    return this.http.delete<void>(`${this.apiUrl}/pages/${id}`, { headers });
  }

  /**
   * Copy a page (creates a new page with "Copy" appended to name)
   */
  copyPage(id: string, projectId?: string): Observable<Page> {
    const headers = new HttpHeaders({
      'x-auth-token': this.authToken,
      'Content-Type': 'application/json'
    });

    const body = projectId ? { projectId } : {};

    return this.http.post<BackendPage>(`${this.apiUrl}/pages/${id}/copy`, body, { headers }).pipe(
      map(page => this.mapBackendPageToFrontend(page))
    );
  }

  /**
   * Map backend page format to frontend format
   */
  private mapBackendPageToFrontend(backendPage: BackendPage): Page {
    return {
      id: backendPage._id,
      name: backendPage.name,
      html: backendPage.html,
      css: backendPage.css,
      js: backendPage.js,
      createdAt: new Date(backendPage.createdAt)
    };
  }

  /**
   * Get default project ID (for now, we'll fetch it or use a stored value)
   * In a real app, this would come from user context or settings
   */
  private getDefaultProjectId(): string {
    // For now, return empty string - the backend will use default project
    // In the future, this could be stored in a service or user context
    return '';
  }

  /**
   * Set default project ID
   */
  setDefaultProjectId(projectId: string): void {
    // Store in localStorage or service state
    localStorage.setItem('defaultProjectId', projectId);
  }

  /**
   * Get stored default project ID
   */
  getStoredProjectId(): string | null {
    return localStorage.getItem('defaultProjectId');
  }
}
