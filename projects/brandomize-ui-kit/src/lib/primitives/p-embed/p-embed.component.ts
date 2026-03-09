import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PEmbedConfig {
  src?: string;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  class?: string[];
}

@Component({
  selector: 'bkit-embed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      @if (getSrc()) {
        <iframe
          [src]="getSrcSafe()"
          class="w-full h-full rounded-lg"
          allowfullscreen
          loading="lazy"
        ></iframe>
      }
    </div>
  `,
  styles: []
})
export class PEmbedComponent {
  @Input() config?: PEmbedConfig;
  @Input() src?: string;

  constructor(
    public theme: ThemeService,
    private sanitizer: DomSanitizer
  ) {}

  getSrc(): string {
    return this.config?.src ?? this.src ?? '';
  }

  getSrcSafe(): SafeResourceUrl {
    const url = this.getSrc();
    if (!url) {
      // Return a safe empty URL instead of empty string
      return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getWrapperClasses(): string {
    const ratio = this.config?.aspectRatio ?? '16/9';
    const ratioMap: Record<string, string> = {
      '16/9': 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '1/1': 'aspect-square',
      auto: 'min-h-[200px]'
    };
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} w-full ${ratioMap[ratio] ?? 'aspect-video'}`.trim();
  }
}
