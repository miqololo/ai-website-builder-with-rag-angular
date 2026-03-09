import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PVideoConfig {
  src?: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  rounded?: 'none' | 'sm' | 'md' | 'lg';
  /** YouTube or Vimeo URL - embeds as iframe */
  embedUrl?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-video',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      @if (getEmbedUrl()) {
        <div class="aspect-video w-full">
          <iframe
            [src]="getEmbedUrlSafe()"
            class="w-full h-full rounded-lg"
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      } @else {
        <video
          [src]="getSrc()"
          [poster]="getPoster()"
          [autoplay]="getAutoplay()"
          [loop]="getLoop()"
          [muted]="getMuted()"
          [controls]="getControls()"
          [attr.playsinline]="true"
          [class]="getVideoClasses()"
          class="w-full"
        ></video>
      }
    </div>
  `,
  styles: []
})
export class PVideoComponent {
  @Input() config?: PVideoConfig;
  @Input() src?: string;
  @Input() embedUrl?: string;
  @Input() poster?: string;
  @Input() autoplay = false;
  @Input() muted = true;
  @Input() controls = true;

  constructor(
    public theme: ThemeService,
    private sanitizer: DomSanitizer
  ) {}

  getEmbedUrlSafe(): SafeResourceUrl {
    const url = this.getEmbedUrl();
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  }

  getSrc(): string {
    return this.config?.src ?? this.src ?? '';
  }

  getEmbedUrl(): string {
    const url = this.config?.embedUrl ?? this.embedUrl ?? '';
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const id = this.extractYoutubeId(url);
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (url.includes('vimeo.com')) {
      const id = this.extractVimeoId(url);
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }
    return url;
  }

  private extractYoutubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
    return match ? match[1] : null;
  }

  private extractVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return match ? match[1] : null;
  }

  getPoster(): string {
    return this.config?.poster ?? this.poster ?? '';
  }

  getAutoplay(): boolean {
    return this.config?.autoplay ?? this.autoplay ?? false;
  }

  getLoop(): boolean {
    return this.config?.loop ?? false;
  }

  getMuted(): boolean {
    return this.config?.muted ?? this.muted ?? true;
  }

  getControls(): boolean {
    return this.config?.controls ?? this.controls ?? true;
  }

  getWrapperClasses(): string {
    const ratio = this.config?.aspectRatio ?? '16/9';
    const ratioMap: Record<string, string> = {
      '16/9': 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '1/1': 'aspect-square',
      auto: ''
    };
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${ratioMap[ratio] ?? 'aspect-video'}`.trim();
  }

  getVideoClasses(): string {
    const rounded = this.config?.rounded ?? 'lg';
    const roundedMap: Record<string, string> = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg'
    };
    return roundedMap[rounded] ?? 'rounded-lg';
  }
}
