import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-pricing-comparison-table-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PButtonComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 overflow-x-auto">
        <table class="w-full min-w-[640px] border-collapse">
          <thead>
            <tr [class]="getHeaderRowClasses()">
              <th [class]="getHeaderThClasses()">Feature</th>
              @for (plan of getPlans(); track plan.name) {
                <th class="px-8 py-4 text-center">
                  <div [class]="getPlanNameClasses()">{{ plan.name }}</div>
                  <div [class]="getPriceClasses()">{{ plan.price }}</div>
                  @if (plan.period) {
                    <div [class]="getPeriodClasses()">{{ plan.period }}</div>
                  }
                  <bkit-button
                    [config]="{
                      href: plan.link || '#',
                      variant: 'primary',
                      size: 'sm',
                      text: plan.buttonText || 'Get started',
                      ariaLabel: plan.buttonText || 'Get started',
                      class: ['mt-4 !inline-block']
                    }"
                  ></bkit-button>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (feature of getFeatures(); track $index) {
              <tr [class]="getBodyRowClasses()">
                <td [class]="getFeatureNameClasses()">{{ feature.name }}</td>
                @for (plan of getPlans(); track plan.name) {
                  <td class="px-8 py-4 text-center">
                    @if (getFeatureValue(plan, feature.key)) {
                      <svg [class]="getCheckIconClasses()" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                      </svg>
                    } @else {
                      <span [class]="getEmptyClasses()">—</span>
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class PricingComparisonTablePbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Compare plans';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'See which plan fits your needs.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getHeaderRowClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `border-b border-${border} dark:border-${borderMutedDark}`;
  }

  getHeaderThClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `py-4 pr-8 text-left text-sm font-semibold text-${text} dark:text-white`;
  }

  getPlanNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold text-${text} dark:text-white`;
  }

  getPriceClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-1 text-2xl font-bold text-${primary} dark:text-${primaryBase}-400`;
  }

  getPeriodClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getBodyRowClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `border-b border-${surfaceMuted} dark:border-${surfaceMutedDark}`;
  }

  getFeatureNameClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `py-4 pr-8 text-sm text-${textMuted} dark:text-gray-300`;
  }

  getCheckIconClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mx-auto h-5 w-5 text-${primary} dark:text-${primaryBase}-400`;
  }

  getEmptyClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return `text-${textMutedLight} dark:text-gray-500`;
  }

  getPlans(): Array<{ name: string; price: string; period?: string; link?: string; buttonText?: string; features?: Record<string, boolean> }> {
    return (this.getData()['plans'] as Array<{ name: string; price: string; period?: string; link?: string; buttonText?: string; features?: Record<string, boolean> }>) || [
      { name: 'Starter', price: '$9', period: '/month', link: '#', buttonText: 'Get started', features: { projects: true, storage: true, support: false, analytics: false } },
      { name: 'Pro', price: '$29', period: '/month', link: '#', buttonText: 'Get started', features: { projects: true, storage: true, support: true, analytics: true } },
      { name: 'Enterprise', price: '$99', period: '/month', link: '#', buttonText: 'Contact', features: { projects: true, storage: true, support: true, analytics: true } }
    ];
  }

  getFeatures(): Array<{ name: string; key: string }> {
    return (this.getData()['features'] as Array<{ name: string; key: string }>) || [
      { name: 'Projects', key: 'projects' },
      { name: 'Storage', key: 'storage' },
      { name: 'Priority support', key: 'support' },
      { name: 'Analytics', key: 'analytics' }
    ];
  }

  getFeatureValue(plan: { features?: Record<string, boolean> }, key: string): boolean {
    return plan.features?.[key] ?? false;
  }
}
