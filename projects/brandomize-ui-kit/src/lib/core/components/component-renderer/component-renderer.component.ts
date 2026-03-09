import { Component, Input, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ViewContainerRef, ViewChild, ComponentRef, inject, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ComponentRendererService } from '@brandomize/core/services/component-renderer.service';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { PComponentRendererComponent } from '@brandomize/core/p-component-renderer/p-component-renderer.component';

/**
 * Component renderer that dynamically renders composition components based on ComponentConfig.
 * 
 * This component:
 * - Accepts a ComponentConfig JSON object
 * - Dynamically loads and renders the appropriate composition component
 * - Applies theme overrides from config.theme
 * - Recursively renders children components
 * - Falls back to p-component-renderer for primitive types
 * 
 * @example
 * ```html
 * <bkit-component-renderer [config]="pageConfig"></bkit-component-renderer>
 * ```
 */
@Component({
  selector: 'bkit-component-renderer',
  standalone: true,
  imports: [CommonModule, PComponentRendererComponent],
  template: `
    @if (config) {
      @if (isPrimitiveType(config.type)) {
        <!-- Render primitives using p-component-renderer -->
        <bkit-p-component-renderer [config]="config"></bkit-p-component-renderer>
      } @else if (isStackType(config.type)) {
        <!-- Render stack (page root) with theme and children -->
        <div [ngClass]="config.classes || []">
          @if (config.children && config.children.length > 0) {
            @for (child of config.children; track child.id || $index) {
              <bkit-component-renderer [config]="child"></bkit-component-renderer>
            }
          }
        </div>
      } @else {
        <!-- Render composition component dynamically with random animation -->
        <div [ngClass]="getCompositionAnimationClass()">
          <ng-container #componentHost></ng-container>
        </div>
      }
    }
  `,
  styles: []
})
export class ComponentRendererComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() config: ComponentConfig | null = null;
  @ViewChild('componentHost', { read: ViewContainerRef }) componentHost!: ViewContainerRef;

  private componentRef: ComponentRef<unknown> | null = null;
  private rendererService = inject(ComponentRendererService);
  private themeService = inject(ThemeService);

  private readonly primitiveTypes = new Set([
    'button', 'card', 'section', 'container', 'stack', 'row', 'grid', 'form',
    'input', 'textarea', 'dropdown', 'text', 'image', 'checkbox', 'radio', 'chip',
    'toggle', 'slider', 'spacer', 'divider', 'link', 'badge', 'avatar', 'icon',
    'progress', 'alert', 'video', 'embed', 'accordion', 'tabs', 'modal', 'breadcrumb', 'box'
  ]);

  ngOnInit(): void {
    // Apply theme override if present (for stack types)
    if (this.config?.theme) {
      this.themeService.setTheme(this.config.theme);
    }
  }

  ngAfterViewInit(): void {
    if (this.config && !this.isPrimitiveType(this.config.type) && !this.isStackType(this.config.type)) {
      this.loadComponent();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && this.componentRef && this.config && !this.isPrimitiveType(this.config.type) && !this.isStackType(this.config.type)) {
      this.componentRef.setInput('config', this.config);
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  /**
   * Get a random animation class for composition (stable per config)
   */
  getCompositionAnimationClass(): string {
    if (!this.config) return '';
    const presets = ['fadeIn', 'slideUp', 'scale'] as const;
    const preset = presets[this.hashCode((this.config.id ?? '') + (this.config.type ?? '')) % presets.length];
    const cls = this.themeService.getAnimationPresetClass(preset);
    return cls ?? '';
  }

  private hashCode(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  /**
   * Check if component type is a primitive
   */
  isPrimitiveType(type: string | undefined): boolean {
    return type ? this.primitiveTypes.has(type) : false;
  }

  /**
   * Check if component type is a stack (page root)
   */
  isStackType(type: string | undefined): boolean {
    return type === 'stack';
  }

  /**
   * Dynamically load and render the composition component
   */
  private loadComponent(): void {
    if (!this.config || !this.componentHost) {
      return;
    }

    // Try to get component - if null, components are still loading
    let componentType = this.rendererService.getComponent(this.config.type);
    
    if (!componentType) {
      // Components are loading asynchronously, wait a bit and retry
      setTimeout(() => {
        componentType = this.rendererService.getComponent(this.config!.type);
        if (componentType) {
          this.renderComponent(componentType);
        } else {
          console.warn(`Component type "${this.config!.type}" is not registered after loading.`);
        }
      }, 100);
      return;
    }

    this.renderComponent(componentType);
  }

  private renderComponent(componentType: Type<unknown>): void {
    if (!this.config || !this.componentHost) {
      return;
    }

    // Apply theme override if present
    if (this.config.theme) {
      this.themeService.setTheme(this.config.theme);
    }

    // Clear previous component
    this.componentHost.clear();

    try {
      // Create component instance
      this.componentRef = this.componentHost.createComponent(componentType);
      
      // Set config input (setInput properly binds @Input and triggers change detection)
      this.componentRef.setInput('config', this.config);

      // Detect changes
      this.componentRef.changeDetectorRef.detectChanges();
    } catch (error) {
      console.error(`Failed to render component "${this.config.type}":`, error);
    }
  }
}
