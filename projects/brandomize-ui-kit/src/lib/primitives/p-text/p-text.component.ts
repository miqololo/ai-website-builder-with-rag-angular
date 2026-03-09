import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export type PTextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'dt' | 'dd';

export interface PTextConfig {
  content?: string;
  tag?: PTextTag;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '7xl';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Optional highlighted substring (wrapped in span with gradient classes) for h1/h2 */
  highlight?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (getTag() === 'h1') {
      <h1 [class]="getTextClasses()">{{ getContentBeforeHighlight() }}
        @if (getHighlightText()) {
          <span [class]="getHighlightClasses()">{{ getHighlightText() }}</span>
        }
        {{ getContentAfterHighlight() }}</h1>
    } @else if (getTag() === 'h2') {
      <h2 [class]="getTextClasses()">{{ getContentBeforeHighlight() }}
        @if (getHighlightText()) {
          <span [class]="getHighlightClasses()">{{ getHighlightText() }}</span>
        }
        {{ getContentAfterHighlight() }}</h2>
    } @else if (getTag() === 'h3') {
      <h3 [class]="getTextClasses()">{{ getContent() }}</h3>
    } @else if (getTag() === 'h4') {
      <h4 [class]="getTextClasses()">{{ getContent() }}</h4>
    } @else if (getTag() === 'h5') {
      <h5 [class]="getTextClasses()">{{ getContent() }}</h5>
    } @else if (getTag() === 'h6') {
      <h6 [class]="getTextClasses()">{{ getContent() }}</h6>
    } @else if (getTag() === 'p') {
      <p [class]="getTextClasses()">{{ getContent() }}</p>
    } @else if (getTag() === 'span') {
      <span [class]="getTextClasses()">{{ getContent() }}</span>
    } @else if (getTag() === 'div') {
      <div [class]="getTextClasses()">{{ getContent() }}</div>
    } @else if (getTag() === 'dt') {
      <dt [class]="getTextClasses()">{{ getContent() }}</dt>
    } @else if (getTag() === 'dd') {
      <dd [class]="getTextClasses()">{{ getContent() }}</dd>
    } @else {
      <p [class]="getTextClasses()">{{ getContent() }}</p>
    }
  `,
  styles: []
})
export class PTextComponent {
  @Input() config?: PTextConfig;
  @Input() content?: string;
  @Input() tag?: PTextTag;
  @Input() size?: PTextConfig['size'];
  @Input() weight?: PTextConfig['weight'];
  @Input() highlight?: string;

  constructor(public theme: ThemeService) {}

  getHighlightText(): string {
    if (!(this.getTag() === 'h1' || this.getTag() === 'h2')) return '';
    const h = (this.config?.highlight ?? this.highlight ?? '').trim();
    return h;
  }

  getContentBeforeHighlight(): string {
    const content = this.getContent();
    const highlight = this.getHighlightText();
    if (!highlight) return content;
    const idx = content.indexOf(highlight);
    return idx >= 0 ? content.slice(0, idx) : content;
  }

  getContentAfterHighlight(): string {
    const content = this.getContent();
    const highlight = this.getHighlightText();
    if (!highlight) return '';
    const idx = content.indexOf(highlight);
    return idx >= 0 ? content.slice(idx + highlight.length) : '';
  }

  hasHighlight(): boolean {
    return this.getHighlightText().length > 0;
  }

  getContent(): string {
    return this.config?.content ?? this.content ?? 'Text';
  }

  getTag(): PTextTag {
    return this.config?.tag ?? this.tag ?? 'p';
  }

  getHighlightClasses(): string {
    return this.theme.getPrimitiveClass('text.highlight', 'inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-gradient-text animate-gradient-shift');
  }

  getTextClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const size = this.config?.size ?? this.size ?? 'base';
    const weight = this.config?.weight ?? this.weight ?? 'normal';
    const color = this.config?.color ?? colors.text ?? 'gray-900';
    const align = this.config?.align;

    // Get classes from theme
    const sizeClass = this.theme.getPrimitiveClass(`text.sizes.${size}`, 
      size === 'xs' ? 'text-xs' :
      size === 'sm' ? 'text-sm' :
      size === 'lg' ? 'text-lg' :
      size === 'xl' ? 'text-xl' :
      size === '2xl' ? 'text-2xl' :
      size === '3xl' ? 'text-3xl' :
      size === '4xl' ? 'text-4xl' :
      size === '5xl' ? 'text-5xl' :
      size === '7xl' ? 'text-7xl' :
      'text-base'
    );

    const weightClass = this.theme.getPrimitiveClass(`text.weights.${weight}`, 
      weight === 'thin' ? 'font-thin' :
      weight === 'light' ? 'font-light' :
      weight === 'medium' ? 'font-medium' :
      weight === 'semibold' ? 'font-semibold' :
      weight === 'bold' ? 'font-bold' :
      weight === 'extrabold' ? 'font-extrabold' :
      'font-normal'
    );

    const alignClass = align ? this.theme.getPrimitiveClass(`text.aligns.${align}`, 
      align === 'left' ? 'text-left' :
      align === 'center' ? 'text-center' :
      align === 'right' ? 'text-right' :
      align === 'justify' ? 'text-justify' :
      ''
    ) : '';

    // Strip any existing text- prefix to prevent double prefixing (e.g., "text-white" -> "white")
    const cleanColor = color.startsWith('text-') ? color.replace(/^text-/, '') : color;
    const colorClass = this.hasHighlight() ? '' : (cleanColor.startsWith('#') ? '' : `text-${cleanColor} dark:text-gray-100`);

    // Parent component classes come first (can override theme classes)
    const classes = [
      ...(this.config?.class ?? []),
      sizeClass,
      weightClass,
      colorClass || (this.hasHighlight() ? '' : `text-${colors.text ?? 'gray-900'} dark:text-gray-100`),
      alignClass
    ].filter(Boolean);

    return classes.join(' ');
  }
}
