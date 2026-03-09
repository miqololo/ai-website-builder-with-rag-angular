import { Injectable, Type } from '@angular/core';

/**
 * Provides ComponentRendererComponent via lazy import to break circular dependency
 * between PComponentRendererComponent and ComponentRendererComponent.
 */
@Injectable({ providedIn: 'root' })
export class ComponentRendererLazyService {
  private componentType: Type<unknown> | null = null;
  private loadPromise: Promise<Type<unknown>> | null = null;

  getComponent(): Promise<Type<unknown>> {
    if (this.componentType) {
      return Promise.resolve(this.componentType);
    }
    if (this.loadPromise) {
      return this.loadPromise;
    }
    this.loadPromise = import('../components/component-renderer/component-renderer.component')
      .then((m) => {
        this.componentType = m.ComponentRendererComponent;
        return this.componentType;
      });
    return this.loadPromise;
  }
}
