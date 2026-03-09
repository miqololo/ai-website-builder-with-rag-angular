import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, Input, ChangeDetectorRef, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule, Smartphone, Tablet, Monitor, X, ZoomIn, ZoomOut, RotateCcw, Undo2, Redo2, Download, ArrowLeft, ArrowRight, RefreshCw, Code } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { BuilderService } from '../../core/services/builder.service';
import { PreviewSize, SelectedElement, Page } from '../../core/models/builder.models';
import { SidebarTab } from '../left-sidebar/left-sidebar.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-preview-area',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './preview-area.component.html',
  styleUrls: ['./preview-area.component.scss']
})
export class PreviewAreaComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('previewFrame', { static: false }) previewFrame!: ElementRef<HTMLIFrameElement>;
  @ViewChild('previewContainer', { static: false }) previewContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('previewWrapper', { static: false }) previewWrapper!: ElementRef<HTMLDivElement>;

  previewSize: PreviewSize = 'desktop';
  currentPage: Page | null = null;
  selectedElement: SelectedElement | null = null;
  resourceEditVisible = false;
  resourceEditElement: HTMLElement | null = null;
  isDragOver = false;
  navigationSettings: any = null;
  @Input() activePanel: SidebarTab | null = null;
  private subscriptions = new Subscription();
  previewUrl!: SafeResourceUrl; // Initialized in constructor
  private navigationCheckInterval: any = null;

  // Lucide icons
  Smartphone = Smartphone;
  Tablet = Tablet;
  Monitor = Monitor;
  X = X;
  ZoomIn = ZoomIn;
  ZoomOut = ZoomOut;
  RotateCcw = RotateCcw;
  Undo2 = Undo2;
  Redo2 = Redo2;
  Download = Download;
  ArrowLeft = ArrowLeft;
  ArrowRight = ArrowRight;
  RefreshCw = RefreshCw;
  Code = Code;
  Math = Math; // Expose Math for template
  
  // Address bar state
  addressBarUrl: string = '';
  canGoBack: boolean = false;
  canGoForward: boolean = false;
  
  // Cache for disabled states to avoid ExpressionChangedAfterItHasBeenCheckedError
  private _canUndo: boolean = false;
  private _canRedo: boolean = false;
  
  // JavaScript toggle state
  jsEnabled: boolean = true; // Default to enabled (current behavior - JS works by default)

  canUndo(): boolean {
    return this._canUndo;
  }

  canRedo(): boolean {
    return this._canRedo;
  }

  undo(): void {
    if (this.builderService.canUndo()) {
      this.builderService.undo();
      // Update cached state
      this._canUndo = this.builderService.canUndo();
      this._canRedo = this.builderService.canRedo();
      this.cdr.markForCheck();
      // Don't reload iframe - changes will be reflected when saved
      // Just reattach handlers if needed
      if (isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => {
          const doc = this.previewFrame?.nativeElement?.contentDocument || 
                      this.previewFrame?.nativeElement?.contentWindow?.document;
          if (doc) {
            this.ensureElementIds(doc);
            this.attachClickHandlers(doc);
          }
        });
      }
    }
  }

  redo(): void {
    if (this.builderService.canRedo()) {
      this.builderService.redo();
      // Update cached state
      this._canUndo = this.builderService.canUndo();
      this._canRedo = this.builderService.canRedo();
      this.cdr.markForCheck();
      // Don't reload iframe - changes will be reflected when saved
      // Just reattach handlers if needed
      if (isPlatformBrowser(this.platformId)) {
        requestAnimationFrame(() => {
          const doc = this.previewFrame?.nativeElement?.contentDocument || 
                      this.previewFrame?.nativeElement?.contentWindow?.document;
          if (doc) {
            this.ensureElementIds(doc);
            this.attachClickHandlers(doc);
          }
        });
      }
    }
  }

  exportPage(): void {
    if (!isPlatformBrowser(this.platformId) || !this.currentPage || !this.previewFrame?.nativeElement) return;
    
    const iframeDoc = this.previewFrame.nativeElement.contentDocument || 
                     this.previewFrame.nativeElement.contentWindow?.document;
    if (!iframeDoc) return;

    const html = iframeDoc.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.currentPage.name || 'page'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  previewSizes = [
    { id: 'mobile' as PreviewSize, label: 'Mobile', width: 375, aspectRatio: 9/16, icon: Smartphone },
    { id: 'tablet' as PreviewSize, label: 'Tablet', width: 768, aspectRatio: 4/3, icon: Tablet },
    { id: 'desktop' as PreviewSize, label: 'Desktop', width: 1440, aspectRatio: 16/9, icon: Monitor }
  ];

  constructor(
    private builderService: BuilderService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize preview URL from environment
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.previewUrl);
  }



  ngAfterViewInit(): void {
    // Attach iframe load handler
    this.attachIframeLoadHandler();
    
    // Set up periodic check for iframe navigation (for same-origin)
    if (isPlatformBrowser(this.platformId)) {
      this.navigationCheckInterval = setInterval(() => {
        this.checkIframeNavigation();
      }, 500);
    }
    
    // Calculate scale multiple times to ensure it's correct
    const calculateScaleWithRetry = (attempts: number = 0) => {
      if (attempts > 10) {
        // Even if dimensions aren't perfect, try to calculate anyway
        this.calculateScale(true);
        return;
      }
      
      setTimeout(() => {
        const container = this.previewContainer?.nativeElement;
        const containerWidth = container ? container.clientWidth - 40 : 0;
        const containerHeight = container ? container.clientHeight - 40 : 0;
        
        if (container && containerWidth > 100 && containerHeight > 100) {
          // Container has reasonable dimensions, calculate scale
          this.calculateScale(true);
          
          // Force change detection after calculation
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          
          // Verify the scale was set correctly
          if (this.scale > 0 && this.scale < 10) {
            // Handlers will be attached when iframe loads
          } else {
            // Scale seems wrong, retry
            calculateScaleWithRetry(attempts + 1);
          }
        } else {
          calculateScaleWithRetry(attempts + 1);
        }
      }, 100 * (attempts + 1));
    };
    
    // Start immediately and also after a short delay
    setTimeout(() => {
      calculateScaleWithRetry();
      this.cdr.markForCheck();
    }, 0);
    setTimeout(() => {
      calculateScaleWithRetry();
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      // Ensure iframe is visible by scrolling container to show left side
      this.ensureIframeVisible();
    }, 200);
    
    // Also ensure visibility after scale calculation completes
    setTimeout(() => {
      this.ensureIframeVisible();
    }, 500);
    
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', () => {
        if (!this.isManualZoom) {
          setTimeout(() => {
            this.calculateScale(true);
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          }, 50);
        }
      });
    }
  }


  setPreviewSize(size: PreviewSize): void {
    this.builderService.setPreviewSize(size);
    // Always reset zoom to fit when changing device size
    this.isManualZoom = false; // Reset manual zoom flag
    // Calculate scale immediately and also after a delay to ensure it works
    // Don't reload iframe - just recalculate scale for the new size
    this.calculateScale(true);
    setTimeout(() => {
      this.calculateScale(true);
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 100);
    setTimeout(() => {
      this.calculateScale(true);
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 300);
  }


  private attachIframeLoadHandler(): void {
    if (!this.previewFrame?.nativeElement) return;
    
    const iframe = this.previewFrame.nativeElement;
    
    // Remove existing load listener if any
    const existingLoadHandler = (iframe as any).__loadHandler;
    if (existingLoadHandler) {
      iframe.removeEventListener('load', existingLoadHandler);
    }
    
    // Add new load listener
    const loadHandler = () => {
      // Use setTimeout to defer URL updates and avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          const iframeWindow = iframe.contentWindow;
          
          // Update address bar URL
          if (iframeWindow && iframeWindow.location) {
            try {
              const newUrl = iframeWindow.location.href;
              // Only update if URL is not 'about:blank' (initial iframe state)
              if (newUrl !== 'about:blank') {
                this.addressBarUrl = newUrl;
                this.updateNavigationState();
              }
            } catch (e) {
              // Cross-origin - can't access location, use environment URL
              this.addressBarUrl = environment.previewUrl;
            }
          }
          
          if (iframeDoc && iframeDoc.body) {
            // Wait a bit for Angular to initialize - use multiple attempts
            let attempts = 0;
            const maxAttempts = 10;
            const checkReady = () => {
              attempts++;
              const body = iframeDoc.body;
              // Check if Angular has initialized (look for app-root or main content)
              const hasContent = body && (body.children.length > 0 || body.textContent?.trim());
              
              if (hasContent || attempts >= maxAttempts) {
                this.attachPreviewHandlers(iframeDoc);
                if (!this.isManualZoom) {
                  this.calculateScale(true);
                }
                this.cdr.markForCheck();
              } else {
                setTimeout(checkReady, 200);
              }
            };
            
            // Start checking after initial delay
            setTimeout(checkReady, 300);
          }
          
          this.cdr.markForCheck();
        } catch (error) {
          // Cross-origin or other errors - this is expected if iframe loads external content
          console.warn('Could not access iframe content:', error);
        }
      }, 0);
    };
    
    (iframe as any).__loadHandler = loadHandler;
    iframe.addEventListener('load', loadHandler);
    
    // If iframe is already loaded, call handler immediately
    if (iframe.contentDocument?.readyState === 'complete') {
      loadHandler();
    }
  }

  updateNavigationState(): void {
    if (!this.previewFrame?.nativeElement) return;
    
    // Use setTimeout to defer the update and avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      try {
        const iframe = this.previewFrame.nativeElement;
        const iframeWindow = iframe.contentWindow;
        
        if (iframeWindow && iframeWindow.history) {
          // Try to track navigation state
          // Since we can't directly check history.length, we'll enable buttons
          // and let the browser handle the actual state
          this.canGoBack = true;
          this.canGoForward = true;
          
          // Listen to popstate events to track navigation
          try {
            iframeWindow.addEventListener('popstate', () => {
              this.checkIframeNavigation();
            });
          } catch (e) {
            // May not be able to add listener due to timing
          }
        } else {
          this.canGoBack = false;
          this.canGoForward = false;
        }
        
        this.cdr.markForCheck();
      } catch (e) {
        // Cross-origin restrictions
        this.canGoBack = false;
        this.canGoForward = false;
        this.cdr.markForCheck();
      }
    }, 0);
  }

  goBack(): void {
    if (!this.previewFrame?.nativeElement) return;
    
    try {
      const iframe = this.previewFrame.nativeElement;
      const iframeWindow = iframe.contentWindow;
      
      if (iframeWindow && iframeWindow.history) {
        iframeWindow.history.back();
        // Update address bar after navigation
        setTimeout(() => {
          try {
            const newUrl = iframeWindow.location.href;
            if (newUrl !== 'about:blank') {
              this.addressBarUrl = newUrl;
              this.updateNavigationState();
              this.cdr.markForCheck();
            }
          } catch (e) {
            // Cross-origin
          }
        }, 100);
      }
    } catch (e) {
      console.warn('Cannot navigate back:', e);
    }
  }

  goForward(): void {
    if (!this.previewFrame?.nativeElement) return;
    
    try {
      const iframe = this.previewFrame.nativeElement;
      const iframeWindow = iframe.contentWindow;
      
      if (iframeWindow && iframeWindow.history) {
        iframeWindow.history.forward();
        // Update address bar after navigation
        setTimeout(() => {
          try {
            const newUrl = iframeWindow.location.href;
            if (newUrl !== 'about:blank') {
              this.addressBarUrl = newUrl;
              this.updateNavigationState();
              this.cdr.markForCheck();
            }
          } catch (e) {
            // Cross-origin
          }
        }, 100);
      }
    } catch (e) {
      console.warn('Cannot navigate forward:', e);
    }
  }

  refresh(): void {
    if (!this.previewFrame?.nativeElement) return;
    
    try {
      const iframe = this.previewFrame.nativeElement;
      const iframeWindow = iframe.contentWindow;
      
      if (iframeWindow && iframeWindow.location) {
        iframeWindow.location.reload();
      }
    } catch (e) {
      console.warn('Cannot refresh:', e);
      // Fallback: reload by updating src
      const currentUrl = environment.previewUrl;
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');
      this.cdr.markForCheck();
      setTimeout(() => {
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(currentUrl);
        this.cdr.markForCheck();
      }, 10);
    }
  }

  navigateToUrl(): void {
    if (!isPlatformBrowser(this.platformId) || !this.addressBarUrl || !this.previewFrame?.nativeElement) return;
    
    try {
      const iframe = this.previewFrame.nativeElement;
      const iframeWindow = iframe.contentWindow;
      
      // Ensure URL is absolute
      let url = this.addressBarUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        const baseUrl = window.location.origin;
        if (url.startsWith('/')) {
          url = baseUrl + url;
        } else {
          url = baseUrl + '/' + url;
        }
      }
      
      // Sanitize and update preview URL immediately (needed for iframe src)
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      
      // Defer addressBarUrl update to avoid ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        if (url !== 'about:blank') {
          this.addressBarUrl = url;
          this.cdr.markForCheck();
        }
      }, 0);
      
      // Navigate iframe
      if (iframeWindow && iframeWindow.location) {
        iframeWindow.location.href = url;
      }
    } catch (e) {
      console.warn('Cannot navigate to URL:', e);
    }
  }

  onAddressBarKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.navigateToUrl();
    }
  }

  private checkIframeNavigation(): void {
    if (!this.previewFrame?.nativeElement) return;
    
    // Use setTimeout to defer the update and avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      try {
        const iframe = this.previewFrame.nativeElement;
        const iframeWindow = iframe.contentWindow;
        
        if (iframeWindow && iframeWindow.location) {
          const currentUrl = iframeWindow.location.href;
          // Only update if URL is not 'about:blank' and has actually changed
          if (currentUrl !== 'about:blank' && currentUrl !== this.addressBarUrl) {
            this.addressBarUrl = currentUrl;
            this.updateNavigationState();
            this.cdr.markForCheck();
          }
        }
      } catch (e) {
        // Cross-origin - can't access location
      }
    }, 0);
  }

  private attachPreviewHandlers(iframeDoc: Document): void {
    // Ensure all elements have IDs for selection
    this.ensureElementIds(iframeDoc);
    
    // Attach click handlers using event delegation
    this.attachClickHandlers(iframeDoc);
    
    // Attach drag handlers for components and layout drop zones
    this.attachDragHandlers(iframeDoc);
    
    // Add global drag handlers to iframe body to accept drops from parent window
    this.attachIframeGlobalDragHandlers(iframeDoc);
    
    // Attach global event interceptors based on JS enabled state
    this.attachEventInterceptors(iframeDoc);
  }

  private performPreviewUpdate(iframeDoc: Document): void {
    if (!this.currentPage) return;

    // Get CSS variables from root element
    const cssVariables = this.getCSSVariables();

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <!-- Lucide Icons - For use in generated content -->
          <script src="https://unpkg.com/lucide@latest"></script>
          <style>
            :root {
              ${cssVariables}
            }
            ${this.currentPage.css || ''}
            body { 
              margin: 0; 
              padding: 0; 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            .selected-section { 
              outline: 3px solid #667eea !important; 
              outline-offset: 2px; 
              position: relative; 
              box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
            }
            .selected-section::before { 
              content: 'Selected'; 
              position: absolute; 
              top: -24px; 
              left: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 4px 8px; 
              font-size: 11px; 
              font-weight: 600;
              border-radius: 4px 4px 0 0;
              z-index: 1000;
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            }
            .component-wrapper {
              min-height: 20px;
              position: relative;
            }
            .layout-drop-zone {
              transition: all 0.2s ease;
            }
            .layout-drop-zone-active {
              border-color: #667eea !important;
              background: rgba(102, 126, 234, 0.05) !important;
              box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
            }
            .layout-drop-zone-hover {
              border-color: #667eea !important;
              background: rgba(102, 126, 234, 0.08) !important;
            }
            .component-drop-hover {
              outline: 2px solid #667eea !important;
              outline-offset: 2px !important;
              background: rgba(102, 126, 234, 0.05) !important;
              border-radius: 4px;
              transition: all 0.2s ease;
            }
            .component-wrapper[draggable="true"] {
              cursor: move;
            }
            .component-wrapper[draggable="true"]:hover {
              outline: 2px dashed #667eea;
              outline-offset: 2px;
            }
          </style>
        </head>
        <body>
          ${this.currentPage.html}
          ${this.currentPage.js ? `<script>${this.currentPage.js}</script>` : ''}
          <script>
            // Initialize Lucide icons after content loads
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();

    // Use requestAnimationFrame for immediate DOM updates
    requestAnimationFrame(() => {
      if (!this.isManualZoom) {
        this.calculateScale(true);
        this.cdr.markForCheck();
      }
      
      // Ensure all elements have IDs for selection
      this.ensureElementIds(iframeDoc);
      
      // Attach click handlers using event delegation
      this.attachClickHandlers(iframeDoc);
      
      // Attach drag handlers for components and layout drop zones
      this.attachDragHandlers(iframeDoc);
      
      // Add global drag handlers to iframe body to accept drops from parent window
      this.attachIframeGlobalDragHandlers(iframeDoc);
      
      this.cdr.detectChanges();
    });
  }

  // Attach global drag handlers to iframe body to accept drops from parent window
  private attachIframeGlobalDragHandlers(doc: Document): void {
    const body = doc.body;
    if (!body) return;

    // Remove existing handlers if any
    const existingDragover = (body as any).__globalDragover;
    const existingDrop = (body as any).__globalDrop;
    if (existingDragover) {
      body.removeEventListener('dragover', existingDragover);
    }
    if (existingDrop) {
      body.removeEventListener('drop', existingDrop);
    }

    // Create new handlers
    const dragoverHandler = (e: DragEvent) => {
      // Only handle if dragging from parent window (has application/json type)
      if (e.dataTransfer?.types.includes('application/json')) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
        }
      }
    };

    const dropHandler = (e: DragEvent) => {
      // This will be handled by the component-specific drop handlers
      // But we need to prevent default to allow the drop
      if (e.dataTransfer?.types.includes('application/json')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Store handlers for cleanup
    (body as any).__globalDragover = dragoverHandler;
    (body as any).__globalDrop = dropHandler;

    body.addEventListener('dragover', dragoverHandler, false);
    body.addEventListener('drop', dropHandler, false);
  }

  private elementIdCounter = 0;

  private generateUniqueId(prefix: string = 'element'): string {
    this.elementIdCounter++;
    return `${prefix}-${Date.now()}-${this.elementIdCounter}-${Math.random().toString(36).substr(2, 9)}`;
  }

  ensureElementIds(doc: Document): void {
    // Add IDs to all meaningful elements for easier selection
    // Get ALL elements, not just specific types
    const allElements = doc.querySelectorAll('*');
    const existingIds = new Set<string>();
    
    // Collect existing IDs from all elements in document
    allElements.forEach(el => {
      if (el.id) {
        existingIds.add(el.id);
      }
    });
    
    // Assign IDs to elements without them
    allElements.forEach((el) => {
      // Skip if already has ID
      if (el.id) return;
      
      // Skip script, style, and other non-selectable elements
      const tagName = el.tagName.toLowerCase();
      const skipTags = ['script', 'style', 'meta', 'link', 'title', 'head', 'html', 'body'];
      if (skipTags.includes(tagName)) return;
      
      // Assign ID to elements that have content or are structural
      const hasContent = el.textContent?.trim() || el.children.length > 0;
      const isStructural = ['div', 'section', 'article', 'main', 'header', 'footer', 'nav', 'aside'].includes(tagName);
      const isTextElement = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'button', 'li', 'label', 'td', 'th', 'strong', 'em', 'b', 'i', 'u'].includes(tagName);
      const isMedia = ['img', 'video', 'iframe'].includes(tagName);
      const isFormElement = ['input', 'textarea', 'select', 'form'].includes(tagName);
      const isListElement = ['ul', 'ol', 'li'].includes(tagName);
      
      // Always assign ID to text elements, even if they don't have children
      // This ensures h1, p, etc. are always selectable
      if (isTextElement) {
        let newId = this.generateUniqueId();
        while (existingIds.has(newId)) {
          newId = this.generateUniqueId();
        }
        el.id = newId;
        existingIds.add(newId);
      }
      // Assign ID to any other element that is meaningful for selection
      else if (hasContent || isStructural || isMedia || isFormElement || isListElement) {
        let newId = this.generateUniqueId();
        // Ensure no collision
        while (existingIds.has(newId)) {
          newId = this.generateUniqueId();
        }
        el.id = newId;
        existingIds.add(newId);
      }
    });
  }

  attachClickHandlers(doc: Document): void {
    // Remove old listeners by cloning elements (cleaner approach)
    // But since we can't easily remove listeners, we'll use event delegation instead
    // Use event delegation on the body for better performance and to catch all elements
    const body = doc.body;
    if (!body) return;

    // Remove existing listener if any (we'll use a single listener on body)
    const existingHandler = (body as any).__clickHandler;
    if (existingHandler) {
      body.removeEventListener('click', existingHandler, true);
    }

    // Create a new handler - optimized for immediate response
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Skip handling clicks on form elements (input, textarea, select, button, etc.)
      // to allow normal form interaction
      const tagName = target.tagName.toLowerCase();
      const isFormElement = ['input', 'textarea', 'select', 'button', 'label', 'form'].includes(tagName);
      if (isFormElement) {
        // Allow normal form element interaction - don't prevent default or handle selection
        return;
      }

      // Check if click is inside a form element (e.g., clicking on a label that wraps an input)
      const closestFormElement = target.closest('input, textarea, select, button, form');
      if (closestFormElement) {
        // Allow normal form element interaction
        return;
      }

      // When JS is disabled, prevent all events (selection mode only)
      // When JS is enabled, allow events to propagate normally but still handle selection
      if (!this.jsEnabled) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Always handle element selection for builder purposes
      this.ngZone.run(() => {
        this.handleElementClick(target, doc);
      });
    };

    // Store handler reference for cleanup
    (body as any).__clickHandler = clickHandler;
    
    // Use capture phase to catch all clicks
    body.addEventListener('click', clickHandler, true);
  }

  private attachEventInterceptors(doc: Document): void {
    const body = doc.body;
    if (!body) return;

    // Remove existing interceptors if any
    const existingInterceptors = (body as any).__eventInterceptors;
    if (existingInterceptors) {
      existingInterceptors.forEach(({ event, handler }: { event: string; handler: EventListener }) => {
        body.removeEventListener(event, handler, true);
      });
    }

    // Create interceptors that prevent events when JS is disabled
    const eventTypes = ['submit', 'change', 'input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'contextmenu'];
    const interceptors: Array<{ event: string; handler: EventListener }> = [];

    eventTypes.forEach(eventType => {
      const handler = (e: Event) => {
        const target = e.target as HTMLElement;
        // Always allow form element interactions (input, textarea, select, button, form)
        if (target) {
          const tagName = target.tagName.toLowerCase();
          const isFormElement = ['input', 'textarea', 'select', 'button', 'label', 'form'].includes(tagName);
          if (isFormElement) {
            // Allow normal form element interaction - don't prevent events
            return;
          }
          // Check if event is inside a form element
          const closestFormElement = target.closest('input, textarea, select, button, form');
          if (closestFormElement) {
            // Allow normal form element interaction
            return;
          }
        }
        // When JS is disabled, prevent all interactive events (except clicks which are handled separately)
        if (!this.jsEnabled && eventType !== 'click') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      };
      body.addEventListener(eventType, handler, true);
      interceptors.push({ event: eventType, handler });
    });

    // Store interceptors for cleanup
    (body as any).__eventInterceptors = interceptors;
  }

  handleElementClick(element: HTMLElement, doc: Document): void {
    // Check if clicked on image/video/background
    if (this.isResourceElement(element)) {
      this.showResourceEdit(element);
      return;
    }

    // Remove previous selection
    doc.querySelectorAll('.selected-section').forEach(el => {
      el.classList.remove('selected-section');
    });

    // Determine target element for selection
    let targetElement = element;
    
    // For text elements (h1, h2, p, span, etc.), select the element itself directly
    if (this.isTextElement(element)) {
      targetElement = element;
    } else {
      // For non-text elements, try to find nearest section container
      const section = this.findNearestSection(element);
      if (section && section !== element) {
        targetElement = section;
      }
    }

    // Ensure element has an ID for selection
    if (!targetElement.id) {
      const doc = targetElement.ownerDocument;
      let newId = this.generateUniqueId();
      while (doc?.getElementById(newId)) {
        newId = this.generateUniqueId();
      }
      targetElement.id = newId;
    }
    
    targetElement.classList.add('selected-section');
    
    const selectedElement: SelectedElement = {
      type: 'component',
      id: targetElement.id,
      element: targetElement
    };
    
    // Immediate update - no delays
    this.builderService.setSelectedElement(selectedElement);
    this.selectedElement = selectedElement;
    this.cdr.markForCheck();
  }

  isTextElement(element: HTMLElement): boolean {
    const textTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a', 'li', 'td', 'th', 'label'];
    return textTags.includes(element.tagName.toLowerCase()) || 
           (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE);
  }

  isResourceElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'img' || tagName === 'video') {
      return true;
    }
    // Check for background image
    try {
      const style = element.ownerDocument?.defaultView?.getComputedStyle(element);
      if (style && style.backgroundImage && style.backgroundImage !== 'none') {
        return true;
      }
    } catch (e) {
      // Ignore errors when accessing computed styles
    }
    return false;
  }

  savePageChanges(iframeDoc?: Document): void {
    if (!this.previewFrame?.nativeElement || !this.currentPage) return;
    
    const doc = iframeDoc || this.previewFrame.nativeElement.contentDocument || 
                this.previewFrame.nativeElement.contentWindow?.document;
    if (doc?.body) {
      const updatedHtml = doc.body.innerHTML;
      this.builderService.updateCurrentPage(updatedHtml, this.currentPage.css);
    }
  }

  onElementDeleted(): void {
    this.selectedElement = null;
    this.builderService.setSelectedElement(null);
    // Don't reload iframe - changes will be reflected automatically
    // Just reattach handlers if needed
    requestAnimationFrame(() => {
      const doc = this.previewFrame?.nativeElement?.contentDocument || 
                  this.previewFrame?.nativeElement?.contentWindow?.document;
      if (doc) {
        this.ensureElementIds(doc);
        this.attachClickHandlers(doc);
        this.attachDragHandlers(doc);
      }
    });
  }

  onElementDuplicated(): void {
    // Don't reload iframe - changes will be reflected automatically
    // Just reattach handlers if needed
    requestAnimationFrame(() => {
      const doc = this.previewFrame?.nativeElement?.contentDocument || 
                  this.previewFrame?.nativeElement?.contentWindow?.document;
      if (doc) {
        this.attachClickHandlers(doc);
        this.attachDragHandlers(doc);
      }
    });
  }

  ngOnInit(): void {
    // Add keyboard shortcuts
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('keydown', this.handleKeyboard);
    }
    
    // Initialize address bar URL from environment
    this.addressBarUrl = environment.previewUrl;
    
    // Initialize undo/redo state
    this._canUndo = this.builderService.canUndo();
    this._canRedo = this.builderService.canRedo();
    
    this.subscriptions.add(
      this.builderService.getPreviewSize().subscribe(size => {
        const previousSize = this.previewSize;
        this.previewSize = size;
        
        // Always reset zoom when preview size changes
        if (previousSize !== size) {
          this.isManualZoom = false;
          this.calculateScale(true);
          requestAnimationFrame(() => {
            this.calculateScale(true);
            // Don't reload iframe - just recalculate scale
            this.cdr.markForCheck();
            this.cdr.detectChanges();
          });
        }
      })
    );

    this.subscriptions.add(
      this.builderService.getCurrentPage().subscribe(page => {
        if (page) {
          this.currentPage = page;
          // Don't reload iframe on page content changes - it loads the live route
          // Only update handlers if needed
          if (this.previewFrame?.nativeElement) {
            const iframe = this.previewFrame.nativeElement;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc && iframeDoc.body) {
              // Just reattach handlers, don't reload
              this.attachPreviewHandlers(iframeDoc);
            }
          }
        }
      })
    );

    this.subscriptions.add(
      this.builderService.getSelectedElement().subscribe(element => {
        this.selectedElement = element;
        // Update selection highlight in iframe
        if (this.previewFrame?.nativeElement) {
          const iframeDoc = this.previewFrame.nativeElement.contentDocument || 
                           this.previewFrame.nativeElement.contentWindow?.document;
          if (iframeDoc) {
            // Remove all previous selections
            iframeDoc.querySelectorAll('.selected-section').forEach(el => {
              el.classList.remove('selected-section');
            });
            
            // Add selection to current element
            if (element) {
              const selectedEl = iframeDoc.getElementById(element.id);
              if (selectedEl) {
                selectedEl.classList.add('selected-section');
              }
            }
          }
        }
      })
    );

    this.subscriptions.add(
      this.builderService.getTheme().subscribe(() => {
        // Don't reload iframe - theme changes will be reflected when saved
        // The live route will show the updated theme automatically
      })
    );

    this.subscriptions.add(
      this.builderService.getNavigationSettings().subscribe(settings => {
        this.navigationSettings = settings;
        // Don't reload iframe - navigation changes will be reflected when saved
        // The live route will show the updated navigation automatically
      })
    );
  }


  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('keydown', this.handleKeyboard);
    }
    this.subscriptions.unsubscribe();
    if (this.navigationCheckInterval) {
      clearInterval(this.navigationCheckInterval);
    }
  }

  handleKeyboard = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
    
    // Delete key - delete selected element
    if (event.key === 'Delete' && this.selectedElement && !isInput) {
      event.preventDefault();
      if (this.selectedElement?.element) {
        this.selectedElement.element.remove();
        this.savePageChanges();
        this.builderService.setSelectedElement(null);
        this.onElementDeleted();
      }
    }
    
    // Ctrl+D or Cmd+D - duplicate element
    if ((event.ctrlKey || event.metaKey) && event.key === 'd' && !isInput) {
      event.preventDefault();
      if (this.selectedElement?.element) {
        const cloned = this.selectedElement.element.cloneNode(true) as HTMLElement;
        // Generate unique ID for cloned element
        const doc = this.selectedElement.element.ownerDocument;
        let newId = this.generateUniqueId();
        while (doc?.getElementById(newId)) {
          newId = this.generateUniqueId();
        }
        cloned.id = newId;
        this.selectedElement.element.parentElement?.insertBefore(
          cloned,
          this.selectedElement.element.nextSibling
        );
        this.savePageChanges();
        this.onElementDuplicated();
      }
    }
    
    // Ctrl+Z or Cmd+Z - undo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey && !isInput) {
      event.preventDefault();
      if (this.builderService.canUndo()) {
        this.builderService.undo();
        // Update cached state
        this._canUndo = this.builderService.canUndo();
        this._canRedo = this.builderService.canRedo();
        setTimeout(() => this.cdr.markForCheck(), 0);
        // Don't reload iframe - changes will be reflected when saved
      }
    }
    
    // Ctrl+Shift+Z or Cmd+Shift+Z - redo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && event.shiftKey && !isInput) {
      event.preventDefault();
      if (this.builderService.canRedo()) {
        this.builderService.redo();
        // Update cached state
        this._canUndo = this.builderService.canUndo();
        this._canRedo = this.builderService.canRedo();
        setTimeout(() => this.cdr.markForCheck(), 0);
        // Don't reload iframe - changes will be reflected when saved
      }
    }
    
    // Escape - deselect element
    if (event.key === 'Escape' && this.selectedElement && !isInput) {
      this.builderService.setSelectedElement(null);
    }
  }

  showResourceEdit(element: HTMLElement): void {
    this.resourceEditElement = element;
    this.resourceEditVisible = true;
    // Trigger change detection to ensure overlay opens
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    
    // Update preview after resource edit to reflect changes
    setTimeout(() => {
      if (this.currentPage && this.previewFrame?.nativeElement) {
        const iframeDoc = this.previewFrame.nativeElement.contentDocument || 
                         this.previewFrame.nativeElement.contentWindow?.document;
        if (iframeDoc?.body) {
          const updatedHtml = iframeDoc.body.innerHTML;
          this.builderService.updateCurrentPage(updatedHtml, this.currentPage.css);
        }
      }
    }, 200);
  }

  closeResourceEdit(): void {
    this.resourceEditVisible = false;
    this.resourceEditElement = null;
  }

  findNearestSection(element: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = element;
    const sectionTags = ['section', 'div', 'article', 'main', 'header', 'footer'];
    
    while (current && current !== current.ownerDocument?.body) {
      const tagName = current.tagName.toLowerCase();
      if (sectionTags.includes(tagName) && current.offsetHeight > 50) {
        return current;
      }
      current = current.parentElement;
    }
    
    return element;
  }

  getPreviewWidth(): number {
    const size = this.previewSizes.find(s => s.id === this.previewSize);
    return size?.width || 1200;
  }

  getPreviewHeight(): number {
    const size = this.previewSizes.find(s => s.id === this.previewSize);
    if (size?.aspectRatio) {
      return Math.round(this.getPreviewWidth() / size.aspectRatio);
    }
    return 800;
  }

  getAddressBarHeight(): number {
    return 48; // Fixed height for address bar container
  }

  getJsToggleHeight(): number {
    return 36; // Fixed height for JS toggle container
  }

  getTotalPreviewHeight(): number {
    return this.getPreviewHeight() + this.getAddressBarHeight() + this.getJsToggleHeight();
  }

  getIframeSandbox(): string | null {
    // Always allow JavaScript - the toggle controls event handling, not JS execution
    return null;
  }

  toggleJsEnabled(): void {
    this.jsEnabled = !this.jsEnabled;
    // Reattach event interceptors to apply new JS enabled state
    // No need to reload iframe - just update event handlers
    requestAnimationFrame(() => {
      const iframeDoc = this.previewFrame?.nativeElement?.contentDocument || 
                       this.previewFrame?.nativeElement?.contentWindow?.document;
      if (iframeDoc) {
        this.attachEventInterceptors(iframeDoc);
        this.attachClickHandlers(iframeDoc);
        this.cdr.markForCheck();
      }
    });
  }

  scale = 1; // Start with 1, will be calculated on init
  minScale = 0.2;
  maxScale = 2;
  zoomStep = 0.1;
  private isManualZoom = false; // Track if user manually zoomed

  private setScale(newScale: number): void {
    if (this.scale !== newScale) {
      this.scale = newScale;
      // Immediately trigger change detection
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      // Also trigger in next tick to ensure it's applied
      setTimeout(() => {
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }, 0);
    }
  }

  zoomIn(): void {
    this.isManualZoom = true;
    this.setScale(Math.min(this.scale + this.zoomStep, this.maxScale));
  }

  zoomOut(): void {
    this.isManualZoom = true;
    this.setScale(Math.max(this.scale - this.zoomStep, this.minScale));
  }

  resetZoom(): void {
    // Reset manual zoom flag and calculate fit
    this.isManualZoom = false;
    this.calculateScale(true);
    // Also ensure change detection runs
    setTimeout(() => {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 0);
  }

  isFullWidthPanel(panel: SidebarTab | null): boolean {
    // All panels now open in sidebar, so preview is always visible
    return false;
  }

  calculateScale(forceReset: boolean = false): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(() => {
      if (!this.previewContainer?.nativeElement || !this.previewWrapper?.nativeElement) {
        // Retry if elements aren't ready
        setTimeout(() => this.calculateScale(forceReset), 50);
        return;
      }
      
      const container = this.previewContainer.nativeElement;
      const containerWidth = container.clientWidth - 40; // padding (20px each side)
      const containerHeight = container.clientHeight - 40; // padding (20px each side)
      
      // Wait for container to have valid dimensions
      if (containerWidth <= 0 || containerHeight <= 0) {
        setTimeout(() => this.calculateScale(forceReset), 50);
        return;
      }
      
      const previewWidth = this.getPreviewWidth();
      const previewHeight = this.getPreviewHeight(); // Use iframe height only
      
      // Calculate scale to fit container while maintaining aspect ratio
      const scaleX = containerWidth / previewWidth;
      const scaleY = containerHeight / previewHeight; // Use iframe height
      
      // Use the smaller scale to ensure it fits completely
      const fitScale = Math.min(scaleX, scaleY);
      const finalScale = Math.max(fitScale, this.minScale);
      
      // Always set to fit scale when forced reset or not manually zoomed
      if (forceReset || !this.isManualZoom) {
        this.setScale(finalScale);
        
        // Also trigger change detection after RAF completes to ensure it's applied
        requestAnimationFrame(() => {
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          // Ensure iframe is visible after scale calculation
          this.ensureIframeVisible();
        });
      }
    });
  }

  ensureIframeVisible(): void {
    if (!isPlatformBrowser(this.platformId) || !this.previewContainer?.nativeElement || !this.previewWrapper?.nativeElement) {
      return;
    }
    
    const container = this.previewContainer.nativeElement;
    const wrapper = this.previewWrapper.nativeElement;
    
    // Wait for next frame to ensure layout is complete
    requestAnimationFrame(() => {
      // Get wrapper position relative to container
      const wrapperRect = wrapper.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      // Calculate the wrapper's position within the container
      const wrapperLeftInContainer = wrapperRect.left - containerRect.left + container.scrollLeft;
      const wrapperRightInContainer = wrapperLeftInContainer + wrapperRect.width;
      
      // Check if wrapper extends beyond the visible area on the right
      // Account for right sidebar (380px) - the visible width is viewport width minus sidebar
      const visibleWidth = window.innerWidth - 380; // Right sidebar width
      const containerVisibleRight = containerRect.left + containerRect.width;
      
      // If wrapper extends beyond visible area, scroll to show left side
      if (wrapperRect.right > containerVisibleRight || wrapperRect.left < containerRect.left + 20) {
        // Scroll to show the left side of the wrapper with some padding
        const targetScrollLeft = Math.max(0, wrapperLeftInContainer - 20);
        container.scrollLeft = targetScrollLeft;
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }

    // Forward drag event to iframe and check for drop targets
    const iframeDoc = this.previewFrame?.nativeElement?.contentDocument || 
                     this.previewFrame?.nativeElement?.contentWindow?.document;
    if (iframeDoc && event.target) {
      // Get element under cursor in iframe
      const iframeRect = this.previewFrame.nativeElement.getBoundingClientRect();
      const x = event.clientX - iframeRect.left;
      const y = event.clientY - iframeRect.top;
      
      const elementAtPoint = iframeDoc.elementFromPoint(x, y);
      if (elementAtPoint) {
        // Find nearest component wrapper or drop zone
        const targetElement = this.findDropTarget(elementAtPoint as HTMLElement);
        
        // Remove all highlights first
        iframeDoc.querySelectorAll('.layout-drop-zone-active').forEach(el => {
          el.classList.remove('layout-drop-zone-active');
        });
        iframeDoc.querySelectorAll('.component-drop-hover').forEach(el => {
          el.classList.remove('component-drop-hover');
        });
        
        if (targetElement) {
          if (targetElement.classList.contains('layout-drop-zone')) {
            targetElement.classList.add('layout-drop-zone-active');
          } else if (targetElement.classList.contains('component-wrapper')) {
            targetElement.classList.add('component-drop-hover');
          }
        }
      }
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    // Only hide if we're leaving the container, not a child element
    const rect = this.previewContainer?.nativeElement?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX;
      const y = event.clientY;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        this.isDragOver = false;
        // Remove all highlights
        const iframeDoc = this.previewFrame?.nativeElement?.contentDocument || 
                         this.previewFrame?.nativeElement?.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.querySelectorAll('.layout-drop-zone-active').forEach(el => {
            el.classList.remove('layout-drop-zone-active');
          });
          iframeDoc.querySelectorAll('.component-drop-hover').forEach(el => {
            el.classList.remove('component-drop-hover');
          });
        }
      }
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    try {
      const iframeDoc = this.previewFrame?.nativeElement?.contentDocument || 
                       this.previewFrame?.nativeElement?.contentWindow?.document;
      
      // Remove all highlights
      if (iframeDoc) {
        iframeDoc.querySelectorAll('.layout-drop-zone-active').forEach(el => {
          el.classList.remove('layout-drop-zone-active');
        });
        iframeDoc.querySelectorAll('.component-drop-hover').forEach(el => {
          el.classList.remove('component-drop-hover');
        });
      }

      // Find the drop target inside the iframe
      let targetElement: HTMLElement | null = null;
      if (iframeDoc && event.target) {
        const iframeRect = this.previewFrame.nativeElement.getBoundingClientRect();
        const x = event.clientX - iframeRect.left;
        const y = event.clientY - iframeRect.top;
        
        const elementAtPoint = iframeDoc.elementFromPoint(x, y);
        if (elementAtPoint) {
          targetElement = this.findDropTarget(elementAtPoint as HTMLElement);
        }
      }

      const jsonData = event.dataTransfer?.getData('application/json');
      let htmlToAdd = '';
      
      if (jsonData) {
        const componentData = JSON.parse(jsonData);
        if (componentData.html) {
          htmlToAdd = componentData.html;
        }
      } else {
        // Fallback to plain text
        const html = event.dataTransfer?.getData('text/plain');
        if (html) {
          htmlToAdd = html;
        }
      }

      if (htmlToAdd && iframeDoc) {
        if (targetElement) {
          if (targetElement.classList.contains('layout-drop-zone')) {
            // Drop into layout drop zone
            this.dropIntoLayoutZone(targetElement, htmlToAdd, iframeDoc);
          } else if (targetElement.classList.contains('component-wrapper')) {
            // Drop into component
            this.dropIntoComponent(targetElement, null, iframeDoc, htmlToAdd);
          }
        } else {
          // Drop at end of page (default behavior)
          this.builderService.addComponentToPage(htmlToAdd);
        }
        
        // Use requestAnimationFrame for immediate update
        requestAnimationFrame(() => {
          const doc = this.previewFrame?.nativeElement?.contentDocument || 
                     this.previewFrame?.nativeElement?.contentWindow?.document;
          if (doc) {
            this.ensureElementIds(doc);
            this.attachClickHandlers(doc);
            this.attachDragHandlers(doc);
          }
        });
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }

  private findDropZone(element: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = element;
    while (current && current !== current.ownerDocument?.body) {
      if (current.classList.contains('layout-drop-zone')) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  // Find the best drop target (component wrapper or layout drop zone)
  private findDropTarget(element: HTMLElement): HTMLElement | null {
    let current: HTMLElement | null = element;
    while (current && current !== current.ownerDocument?.body) {
      // Prefer component wrapper over layout drop zone
      if (current.classList.contains('component-wrapper')) {
        return current;
      }
      if (current.classList.contains('layout-drop-zone')) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  private dropIntoLayoutZone(dropZone: HTMLElement, html: string, doc: Document): void {
    // Convert component HTML to rendered HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const componentHtml = tempDiv.innerHTML;
    
    // Wrap in a div with ID for easy selection
    const wrapperId = `component-${Date.now()}`;
    const wrappedHtml = `<div id="${wrapperId}" class="component-wrapper">${componentHtml}</div>`;
    
    // Create element from HTML
    const tempContainer = doc.createElement('div');
    tempContainer.innerHTML = wrappedHtml;
    const newElement = tempContainer.firstElementChild as HTMLElement;
    
    // Remove placeholder text if it's just "Drop components here" or column names
    const placeholderTexts = ['Drop components here', 'Column 1', 'Column 2', 'Column 3', 'Col 1', 'Col 2', 'Col 3', 'Col 4', 'Sidebar', 'Main content', 'Header', 'Footer', 'Card 1', 'Card 2', 'Card 3', 'Item 1', 'Item 2', 'Item 3', 'Left panel', 'Right panel', 'Centered content'];
    if (dropZone.textContent && placeholderTexts.some(text => dropZone.textContent?.trim() === text)) {
      dropZone.innerHTML = '';
    }
    
    // Append component to drop zone
    dropZone.appendChild(newElement);
    
    // Save changes
    if (this.currentPage && doc.body) {
      const updatedHtml = doc.body.innerHTML;
      this.builderService.updateCurrentPage(updatedHtml, this.currentPage.css);
    }
  }

  private attachDragHandlers(doc: Document): void {
    // Make components draggable within the preview
    const componentWrappers = doc.querySelectorAll('.component-wrapper');
    componentWrappers.forEach((wrapper) => {
      const element = wrapper as HTMLElement;
      
      // Make draggable if not already set
      if (!element.hasAttribute('data-draggable')) {
        element.setAttribute('draggable', 'true');
        element.setAttribute('data-draggable', 'true');
        element.style.cursor = 'move';
        
        element.addEventListener('dragstart', (e: Event) => {
          const dragEvent = e as DragEvent;
          const html = element.outerHTML;
          if (dragEvent.dataTransfer) {
            dragEvent.dataTransfer.effectAllowed = 'move';
            dragEvent.dataTransfer.setData('text/plain', html);
            dragEvent.dataTransfer.setData('application/json', JSON.stringify({
              type: 'move',
              html: html,
              elementId: element.id
            }));
          }
          element.style.opacity = '0.5';
        });
        
        element.addEventListener('dragend', () => {
          element.style.opacity = '1';
        });
      }
      
      // Make all components accept drops (not just layout drop zones)
      if (!element.hasAttribute('data-drop-enabled')) {
        element.setAttribute('data-drop-enabled', 'true');
        
        element.addEventListener('dragover', (e: Event) => {
          const dragEvent = e as DragEvent;
          const jsonData = dragEvent.dataTransfer?.getData('application/json');
          
          // Check if we're dragging a component
          if (jsonData) {
            try {
              const data = JSON.parse(jsonData);
              // Prevent dropping into itself or its descendants
              if (data.type === 'move' && data.elementId) {
                const sourceElement = doc.getElementById(data.elementId);
                if (sourceElement && this.isDescendantOf(sourceElement, element)) {
                  return; // Don't allow dropping into itself or descendants
                }
              }
              
              dragEvent.preventDefault();
              dragEvent.stopPropagation();
              if (dragEvent.dataTransfer) {
                dragEvent.dataTransfer.dropEffect = 'move';
              }
              element.classList.add('component-drop-hover');
            } catch (error) {
              // Ignore parse errors
            }
          } else if (dragEvent.dataTransfer?.types.includes('application/json')) {
            // New component from sidebar
            dragEvent.preventDefault();
            dragEvent.stopPropagation();
            if (dragEvent.dataTransfer) {
              dragEvent.dataTransfer.dropEffect = 'copy';
            }
            element.classList.add('component-drop-hover');
          }
        });
        
        element.addEventListener('dragleave', (e: Event) => {
          const dragEvent = e as DragEvent;
          const relatedTarget = dragEvent.relatedTarget as HTMLElement;
          // Only remove hover if we're actually leaving the element
          if (!element.contains(relatedTarget)) {
            element.classList.remove('component-drop-hover');
          }
        });
        
        element.addEventListener('drop', (e: Event) => {
          const dropEvent = e as DragEvent;
          dropEvent.preventDefault();
          dropEvent.stopPropagation();
          element.classList.remove('component-drop-hover');
          
          const jsonData = dropEvent.dataTransfer?.getData('application/json');
          if (jsonData) {
            try {
              const data = JSON.parse(jsonData);
              if (data.type === 'move' && data.elementId) {
                // Moving existing component
                const sourceElement = doc.getElementById(data.elementId);
                if (sourceElement && sourceElement !== element && !this.isDescendantOf(sourceElement, element)) {
                  this.dropIntoComponent(element, sourceElement, doc);
                }
              } else if (data.html) {
                // Adding new component
                this.dropIntoComponent(element, null, doc, data.html);
              }
            } catch (error) {
              console.error('Error handling drop:', error);
            }
          }
        });
      }
    });
    
    // Keep layout drop zones functionality (for backward compatibility)
    const dropZones = doc.querySelectorAll('.layout-drop-zone');
    dropZones.forEach((zone) => {
      const element = zone as HTMLElement;
      
      // Remove old handlers if they exist to avoid duplicates
      const newElement = element.cloneNode(true) as HTMLElement;
      element.parentNode?.replaceChild(newElement, element);
      const freshElement = newElement;
      
      freshElement.addEventListener('dragover', (e: Event) => {
        const dragEvent = e as DragEvent;
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
        if (dragEvent.dataTransfer) {
          dragEvent.dataTransfer.dropEffect = 'move';
        }
        freshElement.classList.add('layout-drop-zone-hover');
      });
      
      freshElement.addEventListener('dragleave', () => {
        freshElement.classList.remove('layout-drop-zone-hover');
      });
      
      freshElement.addEventListener('drop', (e: Event) => {
        const dropEvent = e as DragEvent;
        dropEvent.preventDefault();
        dropEvent.stopPropagation();
        freshElement.classList.remove('layout-drop-zone-hover');
        
        const jsonData = dropEvent.dataTransfer?.getData('application/json');
        if (jsonData) {
          try {
            const data = JSON.parse(jsonData);
            if (data.type === 'move' && data.elementId) {
              // Moving existing component
              const sourceElement = doc.getElementById(data.elementId);
              if (sourceElement && sourceElement !== freshElement) {
                // Remove placeholder text
                const placeholderTexts = ['Drop components here', 'Column 1', 'Column 2', 'Column 3', 'Col 1', 'Col 2', 'Col 3', 'Col 4', 'Sidebar', 'Main content', 'Header', 'Footer', 'Card 1', 'Card 2', 'Card 3', 'Item 1', 'Item 2', 'Item 3', 'Left panel', 'Right panel', 'Centered content'];
                if (freshElement.textContent && placeholderTexts.some(text => freshElement.textContent?.trim() === text)) {
                  freshElement.innerHTML = '';
                }
                
                freshElement.appendChild(sourceElement);
                
                // Save changes
                if (this.currentPage && doc.body) {
                  const updatedHtml = doc.body.innerHTML;
                  this.builderService.updateCurrentPage(updatedHtml, this.currentPage.css);
                }
                
                // Re-attach handlers
                requestAnimationFrame(() => {
                  this.ensureElementIds(doc);
                  this.attachClickHandlers(doc);
                  this.attachDragHandlers(doc);
                });
              }
            } else if (data.html) {
              // Adding new component
              this.dropIntoLayoutZone(freshElement, data.html, doc);
            }
          } catch (error) {
            console.error('Error handling drop in zone:', error);
          }
        }
      });
    });
  }

  // Helper method to check if an element is a descendant of another
  private isDescendantOf(child: HTMLElement, parent: HTMLElement): boolean {
    let node: HTMLElement | null = child.parentElement;
    while (node) {
      if (node === parent) {
        return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  // Drop component into another component
  private dropIntoComponent(
    targetComponent: HTMLElement,
    sourceElement: HTMLElement | null,
    doc: Document,
    htmlToAdd?: string
  ): void {
    // Find the best insertion point within the target component
    // Look for the actual content element (not the wrapper)
    let insertionTarget: HTMLElement = targetComponent;
    
    // Try to find a more specific insertion point (e.g., inside a card, section, etc.)
    const contentSelectors = [
      '.ui-card',
      '.ui-section',
      '.ui-list',
      '.ui-accordion',
      '.ui-tabs',
      '.ui-sidebar',
      '.ui-modal',
      '.ui-drawer',
      '.ui-form-field',
      '.ui-blockquote',
      '.ui-code--block'
    ];
    
    for (const selector of contentSelectors) {
      const contentElement = targetComponent.querySelector(selector);
      if (contentElement) {
        insertionTarget = contentElement as HTMLElement;
        break;
      }
    }
    
    // If sourceElement is provided, move it
    if (sourceElement) {
      // Remove placeholder text if present
      const placeholderTexts = ['Drop components here', 'Column 1', 'Column 2', 'Column 3', 'Col 1', 'Col 2', 'Col 3', 'Col 4', 'Sidebar', 'Main content', 'Header', 'Footer', 'Card 1', 'Card 2', 'Card 3', 'Item 1', 'Item 2', 'Item 3', 'Left panel', 'Right panel', 'Centered content'];
      if (insertionTarget.textContent && placeholderTexts.some(text => insertionTarget.textContent?.trim() === text)) {
        insertionTarget.innerHTML = '';
      }
      
      insertionTarget.appendChild(sourceElement);
    } else if (htmlToAdd) {
      // Create new component from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlToAdd;
      const componentHtml = tempDiv.innerHTML;
      
      // Wrap in a div with ID for easy selection
      const wrapperId = `component-${Date.now()}`;
      const wrappedHtml = `<div id="${wrapperId}" class="component-wrapper">${componentHtml}</div>`;
      
      // Create element from HTML
      const tempContainer = doc.createElement('div');
      tempContainer.innerHTML = wrappedHtml;
      const newElement = tempContainer.firstElementChild as HTMLElement;
      
      // Remove placeholder text if present
      const placeholderTexts = ['Drop components here', 'Column 1', 'Column 2', 'Column 3', 'Col 1', 'Col 2', 'Col 3', 'Col 4', 'Sidebar', 'Main content', 'Header', 'Footer', 'Card 1', 'Card 2', 'Card 3', 'Item 1', 'Item 2', 'Item 3', 'Left panel', 'Right panel', 'Centered content'];
      if (insertionTarget.textContent && placeholderTexts.some(text => insertionTarget.textContent?.trim() === text)) {
        insertionTarget.innerHTML = '';
      }
      
      insertionTarget.appendChild(newElement);
    }
    
    // Save changes
    if (this.currentPage && doc.body) {
      const updatedHtml = doc.body.innerHTML;
      this.builderService.updateCurrentPage(updatedHtml, this.currentPage.css);
    }
    
    // Re-attach handlers
    requestAnimationFrame(() => {
      this.ensureElementIds(doc);
      this.attachClickHandlers(doc);
      this.attachDragHandlers(doc);
    });
  }

  getCSSVariables(): string {
    // First, try to get variables from the main document
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const variables: string[] = [];
    const foundVars = new Set<string>();
    
    // Get all CSS custom properties that start with --ui- from main document
    for (let i = 0; i < computedStyle.length; i++) {
      const property = computedStyle[i];
      if (property.startsWith('--ui-')) {
        const value = computedStyle.getPropertyValue(property).trim();
        if (value) {
          variables.push(`${property}: ${value};`);
          foundVars.add(property);
        }
      }
    }
    
    // Add all default CSS variables if they're not already set
    // This ensures the iframe has all necessary variables even if they're not in the main document
    const defaultVariables = this.getDefaultCSSVariables();
    defaultVariables.forEach(({ name, value }) => {
      if (!foundVars.has(name)) {
        variables.push(`${name}: ${value};`);
      }
    });
    
    return variables.join('\n              ');
  }

  getDefaultCSSVariables(): Array<{ name: string; value: string }> {
    // Return all default CSS variables from _variables.scss
    // Note: We resolve var() references to their final values where possible
    return [
      // Colors - Primary
      { name: '--ui-primary-50', value: '#f0f9ff' },
      { name: '--ui-primary-100', value: '#e0f2fe' },
      { name: '--ui-primary-200', value: '#bae6fd' },
      { name: '--ui-primary-300', value: '#7dd3fc' },
      { name: '--ui-primary-400', value: '#38bdf8' },
      { name: '--ui-primary-500', value: '#0ea5e9' },
      { name: '--ui-primary-600', value: '#0284c7' },
      { name: '--ui-primary-700', value: '#0369a1' },
      { name: '--ui-primary-800', value: '#075985' },
      { name: '--ui-primary-900', value: '#0c4a6e' },
      { name: '--ui-primary-950', value: '#082f49' },
      
      // Colors - Secondary
      { name: '--ui-secondary-50', value: '#f8fafc' },
      { name: '--ui-secondary-100', value: '#f1f5f9' },
      { name: '--ui-secondary-200', value: '#e2e8f0' },
      { name: '--ui-secondary-300', value: '#cbd5e1' },
      { name: '--ui-secondary-400', value: '#94a3b8' },
      { name: '--ui-secondary-500', value: '#64748b' },
      { name: '--ui-secondary-600', value: '#475569' },
      { name: '--ui-secondary-700', value: '#334155' },
      { name: '--ui-secondary-800', value: '#1e293b' },
      { name: '--ui-secondary-900', value: '#0f172a' },
      { name: '--ui-secondary-950', value: '#020617' },
      
      // Colors - Success
      { name: '--ui-success-50', value: '#f0fdf4' },
      { name: '--ui-success-100', value: '#dcfce7' },
      { name: '--ui-success-200', value: '#bbf7d0' },
      { name: '--ui-success-300', value: '#86efac' },
      { name: '--ui-success-400', value: '#4ade80' },
      { name: '--ui-success-500', value: '#22c55e' },
      { name: '--ui-success-600', value: '#16a34a' },
      { name: '--ui-success-700', value: '#15803d' },
      { name: '--ui-success-800', value: '#166534' },
      { name: '--ui-success-900', value: '#14532d' },
      { name: '--ui-success-950', value: '#052e16' },
      
      // Colors - Warning
      { name: '--ui-warning-50', value: '#fffbeb' },
      { name: '--ui-warning-100', value: '#fef3c7' },
      { name: '--ui-warning-200', value: '#fde68a' },
      { name: '--ui-warning-300', value: '#fcd34d' },
      { name: '--ui-warning-400', value: '#fbbf24' },
      { name: '--ui-warning-500', value: '#f59e0b' },
      { name: '--ui-warning-600', value: '#d97706' },
      { name: '--ui-warning-700', value: '#b45309' },
      { name: '--ui-warning-800', value: '#92400e' },
      { name: '--ui-warning-900', value: '#78350f' },
      { name: '--ui-warning-950', value: '#451a03' },
      
      // Colors - Error/Destructive
      { name: '--ui-error-50', value: '#fef2f2' },
      { name: '--ui-error-100', value: '#fee2e2' },
      { name: '--ui-error-200', value: '#fecaca' },
      { name: '--ui-error-300', value: '#fca5a5' },
      { name: '--ui-error-400', value: '#f87171' },
      { name: '--ui-error-500', value: '#ef4444' },
      { name: '--ui-error-600', value: '#dc2626' },
      { name: '--ui-error-700', value: '#b91c1c' },
      { name: '--ui-error-800', value: '#991b1b' },
      { name: '--ui-error-900', value: '#7f1d1d' },
      { name: '--ui-error-950', value: '#450a0a' },
      
      // Colors - Info
      { name: '--ui-info-50', value: '#eff6ff' },
      { name: '--ui-info-100', value: '#dbeafe' },
      { name: '--ui-info-200', value: '#bfdbfe' },
      { name: '--ui-info-300', value: '#93c5fd' },
      { name: '--ui-info-400', value: '#60a5fa' },
      { name: '--ui-info-500', value: '#3b82f6' },
      { name: '--ui-info-600', value: '#2563eb' },
      { name: '--ui-info-700', value: '#1d4ed8' },
      { name: '--ui-info-800', value: '#1e40af' },
      { name: '--ui-info-900', value: '#1e3a8a' },
      { name: '--ui-info-950', value: '#172554' },
      
      // Neutral Colors
      { name: '--ui-neutral-50', value: '#fafafa' },
      { name: '--ui-neutral-100', value: '#f5f5f5' },
      { name: '--ui-neutral-200', value: '#e5e5e5' },
      { name: '--ui-neutral-300', value: '#d4d4d4' },
      { name: '--ui-neutral-400', value: '#a3a3a3' },
      { name: '--ui-neutral-500', value: '#737373' },
      { name: '--ui-neutral-600', value: '#525252' },
      { name: '--ui-neutral-700', value: '#404040' },
      { name: '--ui-neutral-800', value: '#262626' },
      { name: '--ui-neutral-900', value: '#171717' },
      { name: '--ui-neutral-950', value: '#0a0a0a' },
      
      // Semantic Colors (using var() references)
      { name: '--ui-color-primary', value: 'var(--ui-primary-600)' },
      { name: '--ui-color-primary-hover', value: 'var(--ui-primary-700)' },
      { name: '--ui-color-primary-active', value: 'var(--ui-primary-800)' },
      { name: '--ui-color-primary-light', value: 'var(--ui-primary-50)' },
      { name: '--ui-color-primary-dark', value: 'var(--ui-primary-900)' },
      { name: '--ui-color-secondary', value: 'var(--ui-secondary-600)' },
      { name: '--ui-color-secondary-hover', value: 'var(--ui-secondary-700)' },
      { name: '--ui-color-secondary-active', value: 'var(--ui-secondary-800)' },
      { name: '--ui-color-secondary-light', value: 'var(--ui-secondary-50)' },
      { name: '--ui-color-secondary-dark', value: 'var(--ui-secondary-900)' },
      { name: '--ui-color-success', value: 'var(--ui-success-600)' },
      { name: '--ui-color-success-light', value: 'var(--ui-success-50)' },
      { name: '--ui-color-success-dark', value: 'var(--ui-success-700)' },
      { name: '--ui-color-warning', value: 'var(--ui-warning-600)' },
      { name: '--ui-color-warning-light', value: 'var(--ui-warning-50)' },
      { name: '--ui-color-warning-dark', value: 'var(--ui-warning-700)' },
      { name: '--ui-color-error', value: 'var(--ui-error-600)' },
      { name: '--ui-color-error-light', value: 'var(--ui-error-50)' },
      { name: '--ui-color-error-dark', value: 'var(--ui-error-700)' },
      { name: '--ui-color-info', value: 'var(--ui-info-600)' },
      { name: '--ui-color-info-light', value: 'var(--ui-info-50)' },
      { name: '--ui-color-info-dark', value: 'var(--ui-info-700)' },
      
      // Background Colors
      { name: '--ui-bg-primary', value: '#ffffff' },
      { name: '--ui-bg-secondary', value: 'var(--ui-neutral-50)' },
      { name: '--ui-bg-tertiary', value: 'var(--ui-neutral-100)' },
      { name: '--ui-bg-overlay', value: 'rgba(0, 0, 0, 0.5)' },
      { name: '--ui-bg-disabled', value: 'var(--ui-neutral-100)' },
      
      // Text Colors
      { name: '--ui-text-primary', value: 'var(--ui-neutral-900)' },
      { name: '--ui-text-secondary', value: 'var(--ui-neutral-600)' },
      { name: '--ui-text-tertiary', value: 'var(--ui-neutral-400)' },
      { name: '--ui-text-disabled', value: 'var(--ui-neutral-400)' },
      { name: '--ui-text-inverse', value: '#ffffff' },
      { name: '--ui-text-on-primary', value: '#ffffff' },
      { name: '--ui-text-on-error', value: '#ffffff' },
      
      // Border Colors
      { name: '--ui-border-color', value: 'var(--ui-neutral-200)' },
      { name: '--ui-border-color-hover', value: 'var(--ui-neutral-300)' },
      { name: '--ui-border-color-focus', value: 'var(--ui-primary-500)' },
      { name: '--ui-border-color-error', value: 'var(--ui-error-500)' },
      { name: '--ui-border-color-disabled', value: 'var(--ui-neutral-200)' },
      
      // Spacing
      { name: '--ui-spacing-xs', value: '0.25rem' },
      { name: '--ui-spacing-sm', value: '0.5rem' },
      { name: '--ui-spacing-md', value: '1rem' },
      { name: '--ui-spacing-lg', value: '1.5rem' },
      { name: '--ui-spacing-xl', value: '2rem' },
      { name: '--ui-spacing-2xl', value: '3rem' },
      { name: '--ui-spacing-3xl', value: '4rem' },
      
      // Typography
      { name: '--ui-font-family', value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" },
      { name: '--ui-font-family-mono', value: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace" },
      { name: '--ui-font-size-xs', value: '0.75rem' },
      { name: '--ui-font-size-sm', value: '0.875rem' },
      { name: '--ui-font-size-base', value: '1rem' },
      { name: '--ui-font-size-lg', value: '1.125rem' },
      { name: '--ui-font-size-xl', value: '1.25rem' },
      { name: '--ui-font-size-2xl', value: '1.5rem' },
      { name: '--ui-font-size-3xl', value: '1.875rem' },
      { name: '--ui-font-size-4xl', value: '2.25rem' },
      { name: '--ui-font-weight-normal', value: '400' },
      { name: '--ui-font-weight-medium', value: '500' },
      { name: '--ui-font-weight-semibold', value: '600' },
      { name: '--ui-font-weight-bold', value: '700' },
      { name: '--ui-line-height-tight', value: '1.25' },
      { name: '--ui-line-height-normal', value: '1.5' },
      { name: '--ui-line-height-relaxed', value: '1.75' },
      
      // Border Radius
      { name: '--ui-radius-none', value: '0' },
      { name: '--ui-radius-sm', value: '0.25rem' },
      { name: '--ui-radius-md', value: '0.375rem' },
      { name: '--ui-radius-lg', value: '0.5rem' },
      { name: '--ui-radius-xl', value: '0.75rem' },
      { name: '--ui-radius-2xl', value: '1rem' },
      { name: '--ui-radius-full', value: '9999px' },
      
      // Shadows
      { name: '--ui-shadow-sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
      { name: '--ui-shadow-md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
      { name: '--ui-shadow-lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
      { name: '--ui-shadow-xl', value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
      { name: '--ui-shadow-2xl', value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' },
      { name: '--ui-shadow-inner', value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' },
      
      // Transitions
      { name: '--ui-transition-fast', value: '150ms' },
      { name: '--ui-transition-base', value: '200ms' },
      { name: '--ui-transition-slow', value: '300ms' },
      { name: '--ui-transition-slower', value: '500ms' },
      { name: '--ui-transition-ease', value: 'ease-in-out' },
      
      // Z-index
      { name: '--ui-z-dropdown', value: '1000' },
      { name: '--ui-z-sticky', value: '1020' },
      { name: '--ui-z-fixed', value: '1030' },
      { name: '--ui-z-modal-backdrop', value: '1040' },
      { name: '--ui-z-modal', value: '1050' },
      { name: '--ui-z-popover', value: '1060' },
      { name: '--ui-z-tooltip', value: '1070' },
      { name: '--ui-z-toast', value: '1080' },
      
      // Component Specific Variables
      { name: '--ui-button-height-xs', value: '1.5rem' },
      { name: '--ui-button-height-sm', value: '2rem' },
      { name: '--ui-button-height-md', value: '2.5rem' },
      { name: '--ui-button-height-lg', value: '3rem' },
      { name: '--ui-button-padding-x-xs', value: '0.5rem' },
      { name: '--ui-button-padding-x-sm', value: '0.75rem' },
      { name: '--ui-button-padding-x-md', value: '1rem' },
      { name: '--ui-button-padding-x-lg', value: '1.5rem' },
      { name: '--ui-button-font-size-xs', value: 'var(--ui-font-size-xs)' },
      { name: '--ui-button-font-size-sm', value: 'var(--ui-font-size-sm)' },
      { name: '--ui-button-font-size-md', value: 'var(--ui-font-size-base)' },
      { name: '--ui-button-font-size-lg', value: 'var(--ui-font-size-lg)' },
      { name: '--ui-button-radius', value: 'var(--ui-radius-md)' },
      
      { name: '--ui-input-height-sm', value: '2rem' },
      { name: '--ui-input-height-md', value: '2.5rem' },
      { name: '--ui-input-height-lg', value: '3rem' },
      { name: '--ui-input-padding-x', value: '0.75rem' },
      { name: '--ui-input-padding-y', value: '0.5rem' },
      { name: '--ui-input-font-size', value: 'var(--ui-font-size-base)' },
      { name: '--ui-input-radius', value: 'var(--ui-radius-md)' },
      { name: '--ui-input-border-width', value: '1px' },
      
      { name: '--ui-card-padding', value: 'var(--ui-spacing-lg)' },
      { name: '--ui-card-radius', value: 'var(--ui-radius-lg)' },
      { name: '--ui-card-shadow', value: 'var(--ui-shadow-md)' },
      { name: '--ui-card-bg', value: 'var(--ui-bg-primary)' },
      { name: '--ui-card-border', value: 'var(--ui-border-color)' },
      
      { name: '--ui-badge-height-sm', value: '1.25rem' },
      { name: '--ui-badge-height-md', value: '1.5rem' },
      { name: '--ui-badge-height-lg', value: '1.75rem' },
      { name: '--ui-badge-padding-x-sm', value: '0.375rem' },
      { name: '--ui-badge-padding-x-md', value: '0.5rem' },
      { name: '--ui-badge-padding-x-lg', value: '0.75rem' },
      { name: '--ui-badge-font-size-sm', value: 'var(--ui-font-size-xs)' },
      { name: '--ui-badge-font-size-md', value: 'var(--ui-font-size-sm)' },
      { name: '--ui-badge-font-size-lg', value: 'var(--ui-font-size-base)' },
      { name: '--ui-badge-radius', value: 'var(--ui-radius-full)' },
    ];
  }
}
