import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PageData, PageSection } from '../models/page-renderer.model';

@Injectable({
  providedIn: 'root'
})
export class PageRendererService {
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Render a page section recursively
   */
  renderSection(section: PageSection): string {
    const classes = this.buildSectionClasses(section);
    const styles = this.buildSectionStyles(section);
    
    let content = '';
    let wrapperTag = 'section';
    let wrapperClass = classes;
    const isLayoutComponent = ['container', 'row', 'column'].includes(section.component);
    
    // Render component based on type
    switch (section.component) {
      case 'hero':
        content = this.renderHero(section);
        break;
      case 'text':
        content = this.renderText(section);
        break;
      case 'heading':
        content = this.renderHeading(section);
        break;
      case 'button':
        content = this.renderButton(section);
        break;
      case 'image':
        content = this.renderImage(section);
        break;
      case 'container':
        wrapperTag = 'div';
        wrapperClass = classes;
        content = this.renderContainerContent(section);
        break;
      case 'row':
        wrapperTag = 'div';
        wrapperClass = classes;
        content = this.renderRowContent(section);
        break;
      case 'column':
        wrapperTag = 'div';
        wrapperClass = classes;
        content = this.renderColumnContent(section);
        break;
      case 'card':
        content = this.renderCard(section);
        break;
      default:
        content = this.renderGeneric(section);
    }

    // Render nested children
    if (section.children && section.children.length > 0) {
      const childrenHtml = section.children
        .map(child => this.renderSection(child))
        .join('');
      content += childrenHtml;
    }

    // Close container/row/column inner div tags
    if (isLayoutComponent) {
      content += '</div>';
    }

    return `<${wrapperTag} 
      id="${section.id}" 
      class="${wrapperClass}" 
      style="${styles}"
      ${section.mobileOrder ? `data-mobile-order="${section.mobileOrder}"` : ''}
    >${content}</${wrapperTag}>`;
  }

  /**
   * Build Tailwind classes for a section
   */
  private buildSectionClasses(section: PageSection): string {
    const classes: string[] = [];

    // Container classes
    if (section.enableContainer) {
      classes.push('container', 'mx-auto', 'px-4');
    }

    // Spacing classes
    if (section.enableSectionSpacing) {
      if (section.py !== undefined) {
        classes.push(`py-[${section.py}px]`);
      }
      if (section.px !== undefined) {
        classes.push(`px-[${section.px}px]`);
      }
      if (section.my !== undefined) {
        classes.push(`my-[${section.my}px]`);
      }
      if (section.mx !== undefined) {
        classes.push(`mx-[${section.mx}px]`);
      }
    }

    // Background image
    if (section.enableBackgroundImage && section.backgroundImageUrl) {
      classes.push('bg-cover', 'bg-center', 'bg-no-repeat');
      if (section.backgroundImagePosition) {
        classes.push(section.backgroundImagePosition);
      }
      if (section.backgroundImageFit) {
        classes.push(section.backgroundImageFit);
      }
    }

    // Smooth scroll
    if (section.enableSectionSmooth) {
      classes.push('scroll-smooth');
    }

    // Custom classes
    if (section.className) {
      classes.push(section.className);
    }

    return classes.join(' ');
  }

  /**
   * Build inline styles for a section
   */
  private buildSectionStyles(section: PageSection): string {
    const styles: string[] = [];

    if (section.backgroundColor) {
      styles.push(`background-color: ${section.backgroundColor}`);
    }

    if (section.enableBackgroundImage && section.backgroundImageUrl) {
      styles.push(`background-image: url('${section.backgroundImageUrl}')`);
    }

    if (section.style) {
      Object.entries(section.style).forEach(([key, value]) => {
        styles.push(`${key}: ${value}`);
      });
    }

    return styles.join('; ');
  }

  /**
   * Render Hero section
   */
  private renderHero(section: PageSection): string {
    const title = section.data?.['title'] || section.title || '';
    const subtitle = section.data?.['subtitle'] || section.subtitle || '';
    const buttonText = section.data?.['buttonText'] || '';
    const buttonLink = section.data?.['buttonLink'] || '#';

    return `
      <div class="hero-content flex flex-col items-center justify-center text-center min-h-[500px] px-4">
        ${title ? `<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">${this.escapeHtml(title)}</h1>` : ''}
        ${subtitle ? `<p class="text-xl md:text-2xl lg:text-3xl mb-10 max-w-3xl text-opacity-90">${this.escapeHtml(subtitle)}</p>` : ''}
        ${buttonText ? `<a href="${buttonLink}" class="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">${this.escapeHtml(buttonText)}</a>` : ''}
      </div>
    `;
  }

  /**
   * Render Text section
   */
  private renderText(section: PageSection): string {
    const content = section.data?.['content'] || section.data?.['text'] || '';
    const className = section.data?.['className'] || 'prose prose-lg max-w-none text-gray-700';

    return `<div class="${className}">${this.sanitizeHtml(content)}</div>`;
  }

  /**
   * Render Heading section
   */
  private renderHeading(section: PageSection): string {
    const level = section.data?.['level'] || 2;
    const text = section.data?.['text'] || section.title || '';
    const defaultClasses = {
      1: 'text-4xl md:text-5xl font-bold mb-6 text-gray-900',
      2: 'text-3xl md:text-4xl font-bold mb-4 text-gray-900',
      3: 'text-2xl md:text-3xl font-semibold mb-3 text-gray-800',
      4: 'text-xl md:text-2xl font-semibold mb-2 text-gray-800'
    };
    const className = section.data?.['className'] || defaultClasses[level as keyof typeof defaultClasses] || defaultClasses[2];

    return `<h${level} class="${className}">${this.escapeHtml(text)}</h${level}>`;
  }

  /**
   * Render Button using PrimeNG Button structure
   */
  private renderButton(section: PageSection): string {
    const label = section.data?.['label'] || section.data?.['text'] || 'Button';
    const variant = (section.data?.['variant'] || 'primary') as 'primary' | 'secondary' | 'outline';
    const size = (section.data?.['size'] || 'medium') as 'small' | 'medium' | 'large';
    const icon = section.data?.['icon'] || '';
    const link = section.data?.['link'] || '#';
    const onClick = section.data?.['onClick'] || '';

    // Size mapping
    const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg'
    };

    // Variant mapping with proper Tailwind classes
    const variantClasses: Record<'primary' | 'secondary' | 'outline', string> = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
      secondary: 'bg-white hover:bg-gray-50 text-blue-600 border-blue-600 border-2',
      outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border-blue-600 border-2'
    };

    // PrimeNG Button classes (Unstyled) + Tailwind
    const buttonClasses = [
      'p-button',
      'inline-flex items-center justify-center',
      sizeClasses[size] || sizeClasses.medium,
      variantClasses[variant] || variantClasses.primary,
      'rounded-lg',
      'transition-all duration-200',
      'cursor-pointer',
      'font-medium',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'border'
    ].join(' ');

    const iconHtml = icon ? `<i class="${icon} mr-2"></i>` : '';

    return `
      <a href="${link}" 
         class="${buttonClasses}"
         ${onClick ? `onclick="${onClick}"` : ''}
         role="button">
        ${iconHtml}
        <span class="p-button-label">${this.escapeHtml(label)}</span>
      </a>
    `;
  }

  /**
   * Render Image section
   */
  private renderImage(section: PageSection): string {
    const src = section.data?.['src'] || section.data?.['url'] || '';
    const alt = section.data?.['alt'] || '';
    const className = section.data?.['className'] || 'w-full h-auto rounded-lg shadow-md';

    if (!src) return '';

    return `<img src="${src}" alt="${this.escapeHtml(alt)}" class="${className}" loading="lazy" />`;
  }

  /**
   * Render Container section content
   */
  private renderContainerContent(section: PageSection): string {
    const className = section.data?.['className'] || 'container mx-auto px-4';
    return `<div class="${className}">`;
  }

  /**
   * Render Row section content (using Tailwind grid/flex)
   */
  private renderRowContent(section: PageSection): string {
    const gap = section.data?.['gap'] || 4;
    const className = section.data?.['className'] || `flex flex-wrap gap-${gap}`;
    return `<div class="${className}">`;
  }

  /**
   * Render Column section content
   */
  private renderColumnContent(section: PageSection): string {
    const cols = section.data?.['cols'] || 12;
    const className = section.data?.['className'] || `w-full md:w-${cols}/12`;
    return `<div class="${className}">`;
  }

  /**
   * Render Card section (using PrimeNG Card structure)
   */
  private renderCard(section: PageSection): string {
    const title = section.data?.['title'] || '';
    const content = section.data?.['content'] || '';
    const footer = section.data?.['footer'] || '';

    return `
      <div class="p-card bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        ${title ? `<div class="p-card-header px-6 py-4 border-b border-gray-200 bg-gray-50"><h3 class="text-xl font-semibold text-gray-900">${this.escapeHtml(title)}</h3></div>` : ''}
        <div class="p-card-body p-6 text-gray-700">${this.sanitizeHtml(content)}</div>
        ${footer ? `<div class="p-card-footer px-6 py-4 border-t border-gray-200 bg-gray-50">${this.sanitizeHtml(footer)}</div>` : ''}
      </div>
    `;
  }

  /**
   * Render generic section
   */
  private renderGeneric(section: PageSection): string {
    const content = section.data?.['content'] || section.data?.['html'] || '';
    return this.sanitizeHtml(content);
  }

  /**
   * Render full page with layout
   */
  renderPage(pageData: PageData): string {
    const layoutClasses = this.getLayoutClasses(pageData.layout);
    
    const sectionsHtml = pageData.sections
      .map(section => this.renderSection(section))
      .join('');

    return `
      <div class="page-wrapper ${layoutClasses} w-full" data-page-id="${pageData.id}">
        ${sectionsHtml}
      </div>
    `;
  }

  /**
   * Get layout classes based on layout type
   */
  private getLayoutClasses(layout: 'one' | 'full' | 'ltr' | 'rtl'): string {
    const baseClasses = 'min-h-screen w-full';
    
    switch (layout) {
      case 'full':
        return `${baseClasses}`;
      case 'ltr':
        return `${baseClasses} flex flex-row`;
      case 'rtl':
        return `${baseClasses} flex flex-row-reverse`;
      case 'one':
      default:
        return `${baseClasses} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Sanitize HTML content
   */
  private sanitizeHtml(html: string): string {
    const sanitized = this.sanitizer.sanitize(1, html);
    return sanitized || '';
  }
}
