import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface PageStyling {
  pageId: string;
  customStyles: {
    global?: Record<string, any>;
    components?: Record<string, any>;
    sections?: Record<string, any>;
    responsive?: Record<string, any>;
  };
  tailwindConfig?: Record<string, any>;
  primeNGTheme?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class PageStylingService {
  constructor(private http: HttpClient) {}

  /**
   * Get page styling configuration
   * For testing: loads from example JSON file
   */
  getPageStyling(pageId: string): Observable<PageStyling | null> {
    // For testing: load from example JSON file
    return this.http.get<PageStyling>('/assets/examples/example-page-styling.json').pipe(
      catchError(error => {
        console.warn('Failed to load example styling, using default:', error);
        return of(null);
      })
    );
  }

  /**
   * Apply styling to the page
   */
  applyStyling(styling: PageStyling | null): void {
    if (!styling) return;

    // Apply PrimeNG theme CSS variables
    if (styling.primeNGTheme?.['cssVariables']) {
      this.applyPrimeNGTheme(styling.primeNGTheme['cssVariables']);
    }

    // Apply custom CSS
    if (styling.customStyles) {
      this.applyCustomStyles(styling.customStyles);
    }

    // Apply Tailwind config (if needed for dynamic classes)
    if (styling.tailwindConfig) {
      // Tailwind config is typically handled at build time
      // This is just for reference/documentation
      console.log('Tailwind config:', styling.tailwindConfig);
    }
  }

  /**
   * Apply PrimeNG theme CSS variables
   */
  private applyPrimeNGTheme(cssVariables: Record<string, Record<string, string>>): void {
    Object.entries(cssVariables).forEach(([selector, variables]) => {
      const element = selector === ':root' 
        ? document.documentElement 
        : document.querySelector(selector) || document.documentElement;

      Object.entries(variables).forEach(([property, value]) => {
        (element as HTMLElement).style.setProperty(property, value);
      });
    });
  }

  /**
   * Apply custom styles
   */
  private applyCustomStyles(styles: PageStyling['customStyles']): void {
    if (!styles) return;

    // Remove existing custom styles
    const existingStyle = document.getElementById('page-custom-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Generate CSS from styles object
    let css = '';

    // Global styles
    if (styles.global) {
      css += ':root {\n';
      Object.entries(styles.global).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          css += `  --${key}: ${value};\n`;
        }
      });
      css += '}\n\n';
    }

    // Component styles
    if (styles.components) {
      Object.entries(styles.components).forEach(([component, componentStyles]) => {
        if (componentStyles && typeof componentStyles === 'object') {
          Object.entries(componentStyles).forEach(([variant, variantStyles]) => {
            if (variantStyles && typeof variantStyles === 'object') {
              const selector = `.${component}-${variant}`;
              css += `${selector} {\n`;
              Object.entries(variantStyles).forEach(([prop, val]) => {
                if (prop !== 'hover' && (typeof val === 'string' || typeof val === 'number')) {
                  const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                  css += `  ${cssProp}: ${val};\n`;
                }
              });
              css += '}\n\n';

              // Hover styles
              const hoverStyles = (variantStyles as any).hover;
              if (hoverStyles && typeof hoverStyles === 'object') {
                css += `${selector}:hover {\n`;
                Object.entries(hoverStyles).forEach(([prop, val]) => {
                  if (typeof val === 'string' || typeof val === 'number') {
                    const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                    css += `  ${cssProp}: ${val};\n`;
                  }
                });
                css += '}\n\n';
              }
            }
          });
        }
      });
    }

    // Section styles
    if (styles.sections) {
      Object.entries(styles.sections).forEach(([sectionId, sectionStyles]) => {
        if (sectionStyles && typeof sectionStyles === 'object') {
          const selector = `#${sectionId}`;
          css += `${selector} {\n`;
          Object.entries(sectionStyles).forEach(([prop, val]) => {
            if (typeof val === 'string' || typeof val === 'number') {
              const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
              css += `  ${cssProp}: ${val};\n`;
            }
          });
          css += '}\n\n';
        }
      });
    }

    // Apply CSS
    if (css) {
      const style = document.createElement('style');
      style.id = 'page-custom-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  /**
   * Remove applied styling
   */
  removeStyling(): void {
    const style = document.getElementById('page-custom-styles');
    if (style) {
      style.remove();
    }
  }
}
