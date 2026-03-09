import { Component, Input, OnInit, ViewContainerRef, inject } from '@angular/core';
import { ComponentConfig } from '../../types/component-config.types';
import { ComponentRendererLazyService } from '../../services/component-renderer-lazy.service';

/**
 * Proxy that lazily loads and renders ComponentRendererComponent.
 * Breaks circular dependency: PComponentRenderer -> Proxy -> ComponentRenderer -> PComponentRenderer
 */
@Component({
  selector: 'bkit-component-renderer-proxy',
  standalone: true,
  template: '',
})
export class ComponentRendererProxyComponent implements OnInit {
  @Input() config: ComponentConfig | null = null;

  private vcr = inject(ViewContainerRef);
  private lazyService = inject(ComponentRendererLazyService);

  ngOnInit(): void {
    this.lazyService.getComponent().then((Comp) => {
      if (!this.config) return;
      const ref = this.vcr.createComponent(Comp as never);
      (ref.instance as { config: ComponentConfig | null }).config = this.config;
      ref.changeDetectorRef.detectChanges();
    });
  }
}
