import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-pricing-featured-plan-pb',
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
      <div class="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3 lg:gap-0">
        @for (plan of getPlans(); track $index) {
          <div
            class="group relative flex flex-col rounded-2xl p-8 transition-all duration-300"
            [ngClass]="getCardClasses(plan)"
          >
            <h3
              class="text-base font-semibold leading-7"
              [ngClass]="getPlanNameClasses(plan)"
            >
              {{ plan.name }}
            </h3>
            <p class="mt-4 flex items-baseline gap-x-2">
              <span [class]="getPriceClasses()">{{ plan.price }}</span>
              @if (plan.period) {
                <span [class]="getPeriodClasses()">{{ plan.period }}</span>
              }
            </p>
            <p [class]="getDescriptionClasses()">
              {{ plan.description }}
            </p>
            <ul [class]="getFeaturesListClasses()">
              @for (feature of plan.features; track $index) {
                <li class="flex gap-x-3">
                  <svg class="h-5 w-5 flex-none" [ngClass]="getCheckIconClasses()" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                  </svg>
                  {{ feature }}
                </li>
              }
            </ul>
            <bkit-button
              [config]="{
                href: plan.link || '#',
                variant: plan.featured ? 'primary' : 'outline',
                size: 'md',
                text: plan.buttonText || 'Get started',
                ariaLabel: plan.buttonText || 'Get started',
                class: ['mt-8 block w-full text-center']
              }"
            ></bkit-button>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class PricingFeaturedPlanPbComponent {
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
    return (this.getData()['title'] as string) || 'Pricing plans';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Choose the right plan for your team.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getPlans(): Array<{
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    link?: string;
    buttonText?: string;
    featured?: boolean;
  }> {
    return (this.getData()['plans'] as Array<{ name: string; price: string; period?: string; description: string; features: string[]; link?: string; buttonText?: string; featured?: boolean }>) || [
      { name: 'Starter', price: '$9', period: '/month', description: 'For individuals.', features: ['5 projects', '10GB storage', 'Basic support'], link: '#', buttonText: 'Get started', featured: false },
      { name: 'Pro', price: '$29', period: '/month', description: 'For growing teams.', features: ['Unlimited projects', '100GB storage', 'Priority support', 'Advanced analytics'], link: '#', buttonText: 'Get started', featured: true },
      { name: 'Enterprise', price: '$99', period: '/month', description: 'For large organizations.', features: ['Everything in Pro', 'Unlimited storage', '24/7 support'], link: '#', buttonText: 'Contact sales', featured: false }
    ];
  }

  getRingClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    return `ring-${primary}`;
  }

  getPlanNameFeaturedClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primary} dark:text-${primaryBase}-400`;
  }

  getCheckIconClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primary} dark:text-${primaryBase}-400`;
  }

  getCardClasses(plan: { featured?: boolean }): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    if (plan.featured) {
      return `-m-px z-10 ring-2 ring-${primary} border-0 bg-white shadow-xl`;
    }
    return `border border-${border} bg-${surfaceMuted} dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} hover:-translate-y-1 hover:shadow-lg`;
  }

  getPlanNameClasses(plan: { featured?: boolean }): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    if (plan.featured) {
      return this.getPlanNameFeaturedClasses();
    }
    return `text-${textMuted} dark:text-gray-400`;
  }

  getPriceClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-4xl font-bold tracking-tight text-${text} dark:text-white`;
  }

  getPeriodClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-sm font-semibold leading-6 text-${textMuted} dark:text-gray-400`;
  }

  getDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-6 text-sm leading-6 text-${textMuted} dark:text-gray-300`;
  }

  getFeaturesListClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-8 flex-1 space-y-3 text-sm leading-6 text-${textMuted} dark:text-gray-300`;
  }
}
