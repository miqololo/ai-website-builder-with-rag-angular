import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { loadThemeFromUrl } from '@brandomize/core/theme/theme-loader';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ComponentRendererComponent } from '@brandomize/core/components/component-renderer/component-renderer.component';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ComponentRendererComponent, LucideAngularModule, RouterOutlet],
  template: `
    <!-- Router outlet for routes like /theme-1-test -->
    <router-outlet></router-outlet>
    
    <!-- API-based page loading (when query params are present) -->
    @if (!isRouteActive) {
      @if (loading) {
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <p class="text-gray-600">Loading page...</p>
          </div>
        </div>
      } @else if (error) {
        <div class="flex items-center justify-center min-h-screen">
          <div class="text-center">
            <p class="text-red-600">{{ error }}</p>
            <p class="text-gray-500 mt-2">Make sure websiteId and pageId are provided as query parameters</p>
          </div>
        </div>
      } @else if (pageConfig) {
        <bkit-component-renderer [config]="pageConfig"></bkit-component-renderer>
      }
    }
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'Page Preview';
  pageConfig: ComponentConfig | null = null;
  loading = true;
  error: string | null = null;
  isRouteActive = false;

  // API base URL from environment
  private apiBaseUrl = environment.apiUrl;

  constructor(
    private themeService: ThemeService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check if we're on a route (not root path)
      this.router.events.subscribe(() => {
        const currentUrl = this.router.url;
        // If URL is not just '/' or '/?params', it's a route
        this.isRouteActive = currentUrl !== '/' && !currentUrl.startsWith('/?');
        this.cdr.markForCheck();
      });

      // Initial check
      const currentUrl = this.router.url;
      this.isRouteActive = currentUrl !== '/' && !currentUrl.startsWith('/?');

      // Get websiteId and pageId from query parameters
      this.route.queryParams.subscribe(params => {
        const websiteId = params['websiteId'];
        const pageId = params['pageId'];

        // Only load from API if we have query params and no route is active
        if (websiteId && pageId && !this.isRouteActive) {
          // Load from API render endpoint
          this.loadFromApi(websiteId, pageId);
        } else if (!this.isRouteActive) {
          // No route and no query params - don't show loading
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  /**
   * Load page from API render endpoint
   */
  private loadFromApi(websiteId: string, pageId: string): void {
    this.loading = true;
    this.error = null;

    const url = `${this.apiBaseUrl}/pages/render?websiteId=${websiteId}&pageId=${pageId}`;

    this.http.get<ComponentConfig>(url).subscribe({
      next: (pageConfig) => {
        // Apply theme if present in pageConfig
        if (pageConfig.theme) {
          this.themeService.setTheme(pageConfig.theme);
        }

        // Set page config for rendering
        this.pageConfig = pageConfig;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load page from API:', error);
        this.error = `Failed to load page: ${error.message || 'Unknown error'}`;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  /**
   * Fallback: Load from static files (for development/testing)
   */
  // private loadFromStaticFiles(): void {
  //   // Load theme from URL using standalone utility function
  //   loadThemeFromUrl('/assets/esports.theme.json').subscribe({
  //     next: (theme) => {
  //       console.log('Theme loaded successfully:', theme);
  //     },
  //     error: (error) => {
  //       console.error('Failed to load theme:', error);
  //     }
  //   });

  //   // Load page from URL
  //   this.themeService.loadPageFromUrl('/assets/esports-landing.json').subscribe({
  //     next: (config) => {
  //       this.pageConfig = config;
  //       this.loading = false;
  //       this.cdr.markForCheck();
  //     },
  //     error: (error) => {
  //       console.error('Failed to load page:', error);
  //       this.error = `Failed to load page: ${error.message || 'Unknown error'}`;
  //       this.loading = false;
  //       this.cdr.markForCheck();
  //     }
  //   });
  // }
}
