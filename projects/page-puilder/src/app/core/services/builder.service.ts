import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Theme, Resource, Component, Page, Template, SelectedElement, ChatMessage, PreviewSize, NavigationSettings, NavigationFeature, NavigationFeatureId, ButtonConfiguration, HeaderConfiguration, FooterConfiguration, WebsiteSettings } from '../models/builder.models';
import { AiGeneratorService, StreamEvent } from './ai-generator.service';
import { PagesService } from './pages.service';

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  private currentTheme$ = new BehaviorSubject<Theme>({
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      background: '#ffffff',
      text: '#212529',
      accent: '#ffc107',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '16px',
      xlarge: '24px'
    },
    fontSizes: {
      small: '12px',
      medium: '16px',
      large: '24px',
      xlarge: '32px',
      xxlarge: '48px'
    },
    fontFamily: 'Inter, sans-serif',
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
      loose: '2'
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    transitions: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060
    }
  });

  private resources$ = new BehaviorSubject<Resource[]>([]);
  private components$ = new BehaviorSubject<Component[]>([]);
  private pages$ = new BehaviorSubject<Page[]>([]);
  private templates$ = new BehaviorSubject<Template[]>([]);
  private selectedElement$ = new BehaviorSubject<SelectedElement | null>(null);
  private chatMessages$ = new BehaviorSubject<ChatMessage[]>([]);
  private previewSize$ = new BehaviorSubject<PreviewSize>('desktop');
  private currentPage$ = new BehaviorSubject<Page | null>(null);
  private websiteSettings$ = new BehaviorSubject<WebsiteSettings>({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    language: 'en',
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    },
    contact: {},
    social: {},
    analytics: {}
  });
  private navigationSettings$ = new BehaviorSubject<NavigationSettings>({
    header: {
      enabled: false
    },
    footer: {
      enabled: false
    },
    features: []
  });

  // Undo/Redo history
  private history: Page[] = [];
  private historyIndex = -1;
  private maxHistorySize = 50;

  constructor(
    private http: HttpClient,
    private pagesService: PagesService
  ) {
    this.loadPages();
    this.loadTemplates();
    // Initialize navigation settings with default features
    const defaultFeatures = this.createDefaultFeatures();
    this.navigationSettings$.next({
      header: {
        enabled: false
      },
      footer: {
        enabled: false
      },
      features: defaultFeatures
    });
  }

  // Inject AI Generator Service
  private get aiGeneratorService(): AiGeneratorService {
    return new AiGeneratorService(this.http);
  }

  private loadPages(): void {
    // Load pages from backend
    this.pagesService.getPages().pipe(
      catchError(error => {
        console.error('Failed to load pages from backend:', error);
        // Fallback to default page if backend fails
        const defaultPage: Page = {
          id: '1',
          name: 'Home',
          html: '<div class="page-container"><h1>Welcome</h1><p>Start building your page</p></div>',
          css: '.page-container { padding: 20px; }',
          createdAt: new Date()
        };
        this.pages$.next([defaultPage]);
        this.currentPage$.next(defaultPage);
        return of([]);
      })
    ).subscribe(pages => {
      if (pages.length > 0) {
        this.pages$.next(pages);
        // Set first page as current if none is set
        const currentPageId = this.currentPage$.value?.id;
        if (!currentPageId) {
          this.currentPage$.next(pages[0]);
        } else {
          // Try to find current page in loaded pages, or use first
          const foundPage = pages.find(p => p.id === currentPageId);
          if (foundPage) {
            this.currentPage$.next(foundPage);
          } else {
            this.currentPage$.next(pages[0]);
          }
        }
      } else {
        // Create default page if no pages exist
        const defaultPage: Page = {
          id: '1',
          name: 'Home',
          html: '<div class="page-container"><h1>Welcome</h1><p>Start building your page</p></div>',
          css: '.page-container { padding: 20px; }',
          createdAt: new Date()
        };
        this.pages$.next([defaultPage]);
        this.currentPage$.next(defaultPage);
      }
    });
  }

  /**
   * Refresh pages from backend
   */
  refreshPages(): void {
    this.loadPages();
  }

  private createDefaultFeatures(): NavigationFeature[] {
    return [
      { id: 'user-management', name: 'User Management', enabled: false },
      { id: 'crm', name: 'CRM', enabled: false },
      { id: 'payments', name: 'Payments', enabled: false },
      { id: 'online-courses', name: 'Online courses', enabled: false },
      { id: 'merch-store', name: 'Merch store', enabled: false },
      { id: 'service-store', name: 'Service store', enabled: false },
      { id: 'memberships', name: 'Memberships', enabled: false },
      { id: 'donations', name: 'Donations', enabled: false },
      { id: 'sell-ticket', name: 'Sell Ticket', enabled: false },
      { id: 'events', name: 'Events', enabled: false }
    ];
  }

  // Theme
  getTheme(): Observable<Theme> {
    return this.currentTheme$.asObservable();
  }

  updateTheme(theme: Partial<Theme>): void {
    const currentTheme = this.currentTheme$.value;
    const updatedTheme: Theme = {
      ...currentTheme,
      ...theme,
      colors: { ...currentTheme.colors, ...(theme.colors || {}) },
      borderRadius: { ...currentTheme.borderRadius, ...(theme.borderRadius || {}) },
      fontSizes: { ...currentTheme.fontSizes, ...(theme.fontSizes || {}) },
      fontWeights: theme.fontWeights ? { ...currentTheme.fontWeights, ...theme.fontWeights } : currentTheme.fontWeights,
      lineHeights: theme.lineHeights ? { ...currentTheme.lineHeights, ...theme.lineHeights } : currentTheme.lineHeights,
      letterSpacing: theme.letterSpacing ? { ...currentTheme.letterSpacing, ...theme.letterSpacing } : currentTheme.letterSpacing,
      spacing: theme.spacing ? { ...currentTheme.spacing, ...theme.spacing } : currentTheme.spacing,
      shadows: theme.shadows ? { ...currentTheme.shadows, ...theme.shadows } : currentTheme.shadows,
      transitions: theme.transitions ? { ...currentTheme.transitions, ...theme.transitions } : currentTheme.transitions,
      zIndex: theme.zIndex ? { ...currentTheme.zIndex, ...theme.zIndex } : currentTheme.zIndex
    };
    this.currentTheme$.next(updatedTheme);
  }

  // Resources
  getResources(): Observable<Resource[]> {
    return this.resources$.asObservable();
  }

  addResource(resource: Resource): void {
    this.resources$.next([...this.resources$.value, resource]);
  }

  deleteResource(id: string): void {
    this.resources$.next(this.resources$.value.filter(r => r.id !== id));
  }

  // Components
  getComponents(): Observable<Component[]> {
    return this.components$.asObservable();
  }

  getHeaderComponents(): Observable<Component[]> {
    return new Observable(observer => {
      this.components$.subscribe(components => {
        const headerComponents = components.filter(c => c.type === 'header');
        observer.next(headerComponents);
      });
    });
  }

  getFooterComponents(): Observable<Component[]> {
    return new Observable(observer => {
      this.components$.subscribe(components => {
        const footerComponents = components.filter(c => c.type === 'footer');
        observer.next(footerComponents);
      });
    });
  }

  addComponent(component: Component): void {
    this.components$.next([...this.components$.value, component]);
  }

  deleteComponent(id: string): void {
    this.components$.next(this.components$.value.filter(c => c.id !== id));
  }

  // Pages
  getPages(): Observable<Page[]> {
    return this.pages$.asObservable();
  }

  getCurrentPage(): Observable<Page | null> {
    return this.currentPage$.asObservable();
  }

  addPage(page: Page): void {
    // Create page in backend
    this.pagesService.createPage(page).pipe(
      catchError(error => {
        console.error('Failed to create page in backend:', error);
        // Fallback to local only
        this.pages$.next([...this.pages$.value, page]);
        return of(null);
      })
    ).subscribe(backendPage => {
      if (backendPage) {
        // Use backend page with MongoDB ID
        const updatedPages = [...this.pages$.value];
        // Remove temporary page if it exists
        const tempIndex = updatedPages.findIndex(p => p.id === page.id);
        if (tempIndex >= 0) {
          updatedPages[tempIndex] = backendPage;
        } else {
          updatedPages.push(backendPage);
        }
        this.pages$.next(updatedPages);
        // Set as current page
        this.setCurrentPage(backendPage);
      } else {
        // Fallback: use local page
        this.pages$.next([...this.pages$.value, page]);
        this.setCurrentPage(page);
      }
    });
  }

  setCurrentPage(page: Page): void {
    this.currentPage$.next(page);
  }

  updateCurrentPage(html: string, css?: string, skipHistory: boolean = false): void {
    const current = this.currentPage$.value;
    if (current) {
      const updated = { ...current, html, css };
      
      // Add to history for undo/redo (skip during streaming to avoid too many history entries)
      if (!skipHistory) {
        this.addToHistory(current);
      }
      
      this.currentPage$.next(updated);
      this.pages$.next(
        this.pages$.value.map(p => p.id === current.id ? updated : p)
      );

      // Sync with backend (only if it's a MongoDB ID - check if it's a valid ObjectId format)
      if (current.id && current.id !== '1' && this.isValidObjectId(current.id)) {
        this.pagesService.updatePage(current.id, updated).pipe(
          catchError(error => {
            console.error('Failed to update page in backend:', error);
            return of(null);
          })
        ).subscribe();
      }
    }
  }

  /**
   * Check if string is a valid MongoDB ObjectId format
   */
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  private addToHistory(page: Page): void {
    // Remove any history after current index (when user makes new change after undo)
    this.history = this.history.slice(0, this.historyIndex + 1);
    
    // Add new state to history
    this.history.push({ ...page });
    
    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo(): boolean {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const previousState = this.history[this.historyIndex];
      this.currentPage$.next(previousState);
      this.pages$.next(
        this.pages$.value.map(p => p.id === previousState.id ? previousState : p)
      );
      return true;
    }
    return false;
  }

  redo(): boolean {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const nextState = this.history[this.historyIndex];
      this.currentPage$.next(nextState);
      this.pages$.next(
        this.pages$.value.map(p => p.id === nextState.id ? nextState : p)
      );
      return true;
    }
    return false;
  }

  canUndo(): boolean {
    return this.historyIndex > 0;
  }

  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  deletePage(id: string): void {
    // Soft delete from backend (sets status to 'deleted')
    this.pagesService.deletePage(id).pipe(
      catchError(error => {
        console.error('Failed to delete page from backend:', error);
        // Continue with local deletion even if backend fails
        return of(null);
      })
    ).subscribe(() => {
      // Remove from local list (backend filters deleted pages)
      const pages = this.pages$.value.filter(p => p.id !== id);
      this.pages$.next(pages);
      
      // If deleted page was current, set another as current
      if (this.currentPage$.value?.id === id) {
        this.currentPage$.next(pages.length > 0 ? pages[0] : null);
      }
      
      // Refresh pages from backend to ensure sync
      this.refreshPages();
    });
  }

  copyPage(id: string): void {
    // Copy page via backend API
    this.pagesService.copyPage(id).pipe(
      catchError(error => {
        console.error('Failed to copy page from backend:', error);
        // Fallback to local copy if backend fails
        const page = this.pages$.value.find(p => p.id === id);
        if (page) {
          const copiedPage: Page = {
            id: Date.now().toString(),
            name: `${page.name} (Copy)`,
            html: page.html,
            css: page.css,
            js: page.js,
            createdAt: new Date()
          };
          this.pages$.next([...this.pages$.value, copiedPage]);
          this.setCurrentPage(copiedPage);
        }
        return of(null);
      })
    ).subscribe(copiedPage => {
      if (copiedPage) {
        // Add copied page to list
        this.pages$.next([...this.pages$.value, copiedPage]);
        // Set as current page
        this.setCurrentPage(copiedPage);
        // Refresh pages to ensure sync
        this.refreshPages();
      }
    });
  }

  // Templates
  getTemplates(): Observable<Template[]> {
    return this.templates$.asObservable();
  }

  loadTemplates(): void {
    const templates: Template[] = [
      {
        id: '1',
        name: 'Landing Page',
        description: 'Modern landing page template',
        thumbnail: 'https://via.placeholder.com/300x200',
        html: '<div class="hero"><h1>Welcome</h1><p>Your amazing product</p></div>',
        css: '.hero { padding: 60px 20px; text-align: center; }'
      },
      {
        id: '2',
        name: 'Portfolio',
        description: 'Portfolio showcase template',
        thumbnail: 'https://via.placeholder.com/300x200',
        html: '<div class="portfolio"><h2>My Work</h2></div>',
        css: '.portfolio { padding: 40px; }'
      }
    ];
    this.templates$.next(templates);
  }

  applyTemplate(template: Template): void {
    const page: Page = {
      id: Date.now().toString(),
      name: template.name,
      html: template.html,
      css: template.css,
      createdAt: new Date()
    };
    this.addPage(page);
    this.setCurrentPage(page);
  }

  // Selection
  getSelectedElement(): Observable<SelectedElement | null> {
    return this.selectedElement$.asObservable();
  }

  setSelectedElement(element: SelectedElement | null): void {
    this.selectedElement$.next(element);
  }

  // Chat
  getChatMessages(): Observable<ChatMessage[]> {
    return this.chatMessages$.asObservable();
  }

  addChatMessage(message: ChatMessage): void {
    this.chatMessages$.next([...this.chatMessages$.value, message]);
  }

  // Preview Size
  getPreviewSize(): Observable<PreviewSize> {
    return this.previewSize$.asObservable();
  }

  setPreviewSize(size: PreviewSize): void {
    this.previewSize$.next(size);
  }

  // Navigation Settings
  getNavigationSettings(): Observable<NavigationSettings> {
    return this.navigationSettings$.asObservable();
  }

  updateNavigationSettings(settings: Partial<NavigationSettings>): void {
    const current = this.navigationSettings$.value;
    const updated: NavigationSettings = {
      header: { ...current.header, ...(settings.header || {}) },
      footer: { ...current.footer, ...(settings.footer || {}) },
      features: settings.features || current.features
    };
    this.navigationSettings$.next(updated);
  }

  toggleHeaderEnabled(enabled: boolean): void {
    const current = this.navigationSettings$.value;
    this.navigationSettings$.next({
      ...current,
      header: { ...current.header, enabled }
    });
  }

  toggleFooterEnabled(enabled: boolean): void {
    const current = this.navigationSettings$.value;
    this.navigationSettings$.next({
      ...current,
      footer: { ...current.footer, enabled }
    });
  }

  toggleFeature(featureId: NavigationFeatureId, enabled: boolean): void {
    const current = this.navigationSettings$.value;
    const updatedFeatures = current.features.map(feature =>
      feature.id === featureId ? { ...feature, enabled } : feature
    );
    
    this.navigationSettings$.next({
      ...current,
      features: updatedFeatures
    });
  }

  updateFeatureButtonConfig(featureId: NavigationFeatureId, buttonConfig: ButtonConfiguration): void {
    const current = this.navigationSettings$.value;
    const updatedFeatures = current.features.map(feature =>
      feature.id === featureId ? { ...feature, buttonConfig } : feature
    );
    
    this.navigationSettings$.next({
      ...current,
      features: updatedFeatures
    });
  }

  // Website Settings
  getWebsiteSettings(): Observable<WebsiteSettings> {
    return this.websiteSettings$.asObservable();
  }

  updateWebsiteSettings(settings: Partial<WebsiteSettings>): void {
    const current = this.websiteSettings$.value;
    const updated: WebsiteSettings = {
      ...current,
      ...settings,
      seo: { ...current.seo, ...(settings.seo || {}) },
      contact: { ...current.contact, ...(settings.contact || {}) },
      social: { ...current.social, ...(settings.social || {}) },
      analytics: settings.analytics ? { ...current.analytics, ...settings.analytics } : current.analytics
    };
    this.websiteSettings$.next(updated);
  }

  // Convert component HTML (ui-lib removed - returns HTML as-is)
  private convertComponentHTML(html: string): string {
    // Return HTML unchanged since ui-lib conversion is no longer needed
    return html;
  }

  // Add component to current page
  addComponentToPage(html: string, insertPosition?: 'start' | 'end' | 'after-selected'): void {
    const current = this.currentPage$.value;
    if (!current) return;

    // Convert Angular component HTML to rendered HTML
    const convertedHtml = this.convertComponentHTML(html);
    
    // Wrap in a div with ID for easy selection
    const wrapperId = `component-${Date.now()}`;
    const wrappedHtml = `<div id="${wrapperId}" class="component-wrapper">${convertedHtml}</div>`;
    
    let updatedHtml = current.html;
    
    if (insertPosition === 'start') {
      updatedHtml = wrappedHtml + updatedHtml;
    } else if (insertPosition === 'after-selected') {
      const selected = this.selectedElement$.value;
      if (selected && selected.element) {
        // Try to insert after selected element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = updatedHtml;
        const selectedEl = tempDiv.querySelector(`#${selected.id}`);
        if (selectedEl && selectedEl.parentElement) {
          const newEl = document.createElement('div');
          newEl.innerHTML = wrappedHtml;
          selectedEl.parentElement.insertBefore(newEl.firstChild || newEl, selectedEl.nextSibling);
          updatedHtml = tempDiv.innerHTML;
        } else {
          updatedHtml += wrappedHtml;
        }
      } else {
        updatedHtml += wrappedHtml;
      }
    } else {
      updatedHtml += wrappedHtml;
    }

    this.updateCurrentPage(updatedHtml, current.css);
  }

  // AI Chat - now integrated with backend and applies to page
  async sendAIMessage(prompt: string, selectedElement?: SelectedElement): Promise<void> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date(),
      selectedElement
    };
    this.addChatMessage(userMessage);

    // Get current page
    const currentPage = this.currentPage$.value;
    if (!currentPage) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'No page selected. Please create or select a page first.',
        timestamp: new Date(),
        isLoading: false
      };
      this.addChatMessage(errorMessage);
      return;
    }

    // Create simple AI message - just show status, content streams to preview
    const aiMessageId = (Date.now() + 1).toString();
    let aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: 'Generating content... Watch the preview area!',
      timestamp: new Date(),
      isLoading: true
    };
    this.addChatMessage(aiMessage);

    try {
      // Use AI Generator Service to generate and apply to page
      const stream = this.aiGeneratorService.generateAndApply({
        prompt: prompt,
        type: 'both',
        pageId: currentPage.id,
      });

      stream.subscribe({
        next: (event) => {
          if (event.type === 'update' && (event.html || event.js)) {
            // Update page content in real-time - this will trigger preview update
            const current = this.currentPage$.value;
            if (current) {
              const updatedHtml = event.html || current.html;
              const updatedJs = event.js ? (current.js || '') + '\n' + event.js : current.js;
              
              // Update the page - skip history during streaming to avoid too many entries
              // This triggers preview refresh automatically via subscription
              this.updateCurrentPage(updatedHtml, current.css, true);
              
              // Update JS if provided
              if (event.js) {
                const updatedPage = { ...current, html: updatedHtml, js: updatedJs };
                this.currentPage$.next(updatedPage);
                this.pages$.next(
                  this.pages$.value.map(p => p.id === current.id ? updatedPage : p)
                );
                
                // Sync with backend if valid MongoDB ID
                if (this.isValidObjectId(current.id)) {
                  this.pagesService.updatePage(current.id, updatedPage).pipe(
                    catchError(error => {
                      console.error('Failed to sync page update:', error);
                      return of(null);
                    })
                  ).subscribe();
                }
              }
            }

            // Keep chat message simple - just show it's generating
            const updatedMessages = this.chatMessages$.value.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, content: 'Generating content... Watch the preview area!', isLoading: true }
                : msg
            );
            this.chatMessages$.next(updatedMessages);
          } else if (event.type === 'content' && event.data) {
            // Content is streaming - preview will update via page updates
            // Keep chat message simple
            const updatedMessages = this.chatMessages$.value.map(msg =>
              msg.id === aiMessageId
                ? { ...msg, content: 'Generating content... Watch the preview area!', isLoading: true }
                : msg
            );
            this.chatMessages$.next(updatedMessages);
          } else if (event.type === 'done') {
            // Final update if HTML/JS provided - add to history now
            if (event.html || event.js) {
              const current = this.currentPage$.value;
              if (current) {
                const updatedHtml = event.html || current.html;
                const updatedJs = event.js ? (current.js || '') + '\n' + event.js : current.js;
                const updatedPage = { ...current, html: updatedHtml, js: updatedJs };
                // Add final state to history
                this.updateCurrentPage(updatedHtml, current.css, false);
                this.currentPage$.next(updatedPage);
                this.pages$.next(
                  this.pages$.value.map(p => p.id === current.id ? updatedPage : p)
                );
                
                // Sync final state with backend if valid MongoDB ID
                if (this.isValidObjectId(current.id)) {
                  this.pagesService.updatePage(current.id, updatedPage).pipe(
                    catchError(error => {
                      console.error('Failed to sync final page update:', error);
                      return of(null);
                    })
                  ).subscribe();
                }
              }
            }

            // Show completion message in chat
            const successMessage: ChatMessage = {
              id: aiMessageId,
              role: 'assistant',
              content: 'Content generated successfully! Check the preview area.',
              timestamp: new Date(),
              isLoading: false
            };
            const updatedMessages = this.chatMessages$.value.map(msg =>
              msg.id === aiMessageId ? successMessage : msg
            );
            this.chatMessages$.next(updatedMessages);
          } else if (event.type === 'error') {
            // Handle error
            const errorMessage: ChatMessage = {
              id: aiMessageId,
              role: 'assistant',
              content: `Error: ${event.error || 'Failed to generate content'}`,
              timestamp: new Date(),
              isLoading: false
            };
            const updatedMessages = this.chatMessages$.value.map(msg =>
              msg.id === aiMessageId ? errorMessage : msg
            );
            this.chatMessages$.next(updatedMessages);
          }
        },
        error: (error) => {
          const errorMessage: ChatMessage = {
            id: aiMessageId,
            role: 'assistant',
            content: `Error: ${error.message || 'Failed to connect to AI service'}`,
            timestamp: new Date(),
            isLoading: false
          };
          const updatedMessages = this.chatMessages$.value.map(msg =>
            msg.id === aiMessageId ? errorMessage : msg
          );
          this.chatMessages$.next(updatedMessages);
        }
      });
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: aiMessageId,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to generate content'}`,
        timestamp: new Date(),
        isLoading: false
      };
      const updatedMessages = this.chatMessages$.value.map(msg =>
        msg.id === aiMessageId ? errorMessage : msg
      );
      this.chatMessages$.next(updatedMessages);
    }
  }
}
