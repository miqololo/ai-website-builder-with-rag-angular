import { Component, Input, Output, EventEmitter, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PModalConfig {
  title?: string;
  open?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50 transition-opacity" (click)="close()"></div>
          <div [class]="getModalClasses()">
            @if (getTitle() || isClosable()) {
              <div [class]="getHeaderClasses()">
                @if (getTitle()) {
                  <h3 [class]="getTitleClasses()">{{ getTitle() }}</h3>
                }
                @if (isClosable()) {
                  <button
                    type="button"
                    (click)="close()"
                    [class]="getCloseButtonClasses()"
                  >
                    <span class="sr-only">Close</span>
                    <span class="text-xl">×</span>
                  </button>
                }
              </div>
            }
            <div class="p-4">
              <ng-content></ng-content>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
})
export class PModalComponent implements OnInit, OnChanges {
  @Input() config?: PModalConfig;
  @Input() title?: string;
  @Input() open = false;
  @Input() closable = true;
  @Output() closed = new EventEmitter<void>();

  openSignal = signal(false);

  constructor(public theme: ThemeService) {}

  ngOnInit(): void {
    this.openSignal.set(this.config?.open ?? this.open);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['open']) {
      this.openSignal.set(this.config?.open ?? this.open);
    }
  }

  isOpen(): boolean {
    return this.openSignal();
  }

  getTitle(): string {
    return this.config?.title ?? this.title ?? '';
  }

  isClosable(): boolean {
    return this.config?.closable ?? this.closable ?? true;
  }

  close(): void {
    if (this.isClosable()) {
      this.openSignal.set(false);
      this.closed.emit();
    }
  }

  openModal(): void {
    this.openSignal.set(true);
  }

  getModalClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const surfaceDark = colors.surfaceDark ?? 'gray-900';
    const size = this.config?.size ?? 'md';
    const sizeMap: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-[90vw]'
    };
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} relative bg-white dark:bg-${surfaceDark} rounded-lg shadow-xl w-full ${sizeMap[size] ?? 'max-w-md'}`.trim();
  }

  getHeaderClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `flex items-center justify-between p-4 border-b border-${border} dark:border-${borderMutedDark}`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold text-${text} dark:text-gray-100`;
  }

  getCloseButtonClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const textMutedLight = colors.textMutedLight ?? 'gray-400';
    const surfaceMuted = colors.surfaceMuted ?? 'gray-100';
    const textMuted = colors.textMuted ?? 'gray-600';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-700';
    return `rounded-md p-1.5 text-${textMutedLight} hover:bg-${surfaceMuted} hover:text-${textMuted} dark:hover:bg-${surfaceMutedDark} dark:hover:text-gray-300`;
  }
}
