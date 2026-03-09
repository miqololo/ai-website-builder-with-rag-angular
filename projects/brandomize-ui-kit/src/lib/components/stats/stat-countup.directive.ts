import {
  Directive,
  Input,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Parse stat value like "2M+", "10K+", "99.9%", "$500" into { target, prefix, suffix } */
export function parseStatValue(
  value: string
): { target: number; prefix: string; suffix: string; decimals?: number } | null {
  if (!value || typeof value !== 'string') return null;
  const s = value.trim();
  const match = s.match(/^(\$)?([\d.,]+)\s*([KMB])?\s*([+\-%]?)$/i);
  if (!match) return null;
  const [, prefix = '', numStr, multiplier, suffix = ''] = match;
  const decimals = (numStr.split('.')[1] ?? '').length;
  let num = parseFloat(numStr.replace(/,/g, ''));
  if (isNaN(num)) return null;
  const mul = multiplier?.toUpperCase();
  if (mul === 'K') num *= 1e3;
  else if (mul === 'M') num *= 1e6;
  else if (mul === 'B') num *= 1e9;
  return { target: num, prefix, suffix, decimals };
}

/** Format number for display (e.g. 2000000 -> "2M", 99.9 -> "99.9") */
function formatStatNumber(
  n: number,
  parsed: { target: number; decimals?: number }
): string {
  const { target, decimals = 0 } = parsed;
  if (target >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (target >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (target >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  if (decimals > 0) return n.toFixed(decimals);
  return Math.round(n).toString();
}

@Directive({
  selector: '[statCountup]',
  standalone: true,
})
export class StatCountupDirective implements AfterViewInit, OnDestroy {
  @Input() statCountup = '';
  @Input() statPrefix = '';
  @Input() statSuffix: string | undefined = '';
  @Input() statDuration = 1800;

  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const parsed = parseStatValue(this.statCountup || this.el.nativeElement.textContent || '');
    if (!parsed) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || this.hasAnimated) return;
          this.hasAnimated = true;
          this.animate(parsed);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private animate(parsed: { target: number; prefix: string; suffix: string }): void {
    const el = this.el.nativeElement;
    const prefix = this.statPrefix || parsed.prefix;
    const suffix = this.statSuffix || parsed.suffix;
    const target = parsed.target;
    const duration = this.statDuration;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted = formatStatNumber(current, parsed);
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${prefix}${formatStatNumber(target, parsed)}${suffix}`;
    };
    requestAnimationFrame(tick);
  }
}
