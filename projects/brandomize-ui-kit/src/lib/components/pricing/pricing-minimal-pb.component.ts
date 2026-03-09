import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-pricing-minimal-pb',
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
      <div class="mx-auto mt-16 max-w-2xl">
        <div [class]="getListClasses()">
          @for (plan of getPlans(); track $index) {
            <div class="group flex flex-col gap-x-8 gap-y-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div class="flex-1">
                <h3 [class]="getPlanNameClasses()">{{ plan.name }}</h3>
                <p [class]="getDescriptionClasses()">{{ plan.description }}</p>
              </div>
              <div class="flex items-center gap-x-4 sm:flex-col sm:items-end sm:gap-2">
                <p [class]="getPriceWrapperClasses()">
                  {{ plan.price }}
                  <span [class]="getPeriodClasses()">{{ plan.period }}</span>
                </p>
                <bkit-button
                  [config]="{
                    href: plan.link || '#',
                    variant: 'primary',
                    size: 'md',
                    text: plan.buttonText || 'Get started',
                    ariaLabel: plan.buttonText || 'Get started',
                    class: ['shrink-0']
                  }"
                ></bkit-button>
              </div>
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class PricingMinimalPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'muted') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Simple pricing';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Choose the plan that works for you.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getListClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `divide-y divide-${border} dark:divide-${borderMutedDark}`;
  }

  getPlanNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold text-${text} dark:text-white`;
  }

  getDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm leading-6 text-${textMuted} dark:text-gray-300`;
  }

  getPriceWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-2xl font-bold text-${text} dark:text-white`;
  }

  getPeriodClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-base font-normal text-${textMutedLight} dark:text-gray-400`;
  }

  getPlans(): Array<{ name: string; description: string; price: string; period: string; link?: string; buttonText?: string }> {
    return (this.getData()['plans'] as Array<{ name: string; description: string; price: string; period: string; link?: string; buttonText?: string }>) || [
      { name: 'Starter', description: 'Perfect for small projects.', price: '$9', period: '/month', link: '#', buttonText: 'Get started' },
      { name: 'Pro', description: 'For growing teams.', price: '$29', period: '/month', link: '#', buttonText: 'Get started' },
      { name: 'Enterprise', description: 'For large organizations.', price: '$99', period: '/month', link: '#', buttonText: 'Contact sales' }
    ];
  }
}
