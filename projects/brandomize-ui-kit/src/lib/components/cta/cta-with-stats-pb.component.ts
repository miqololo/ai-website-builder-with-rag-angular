import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PRowComponent } from '@brandomize/primitives/p-row/p-row.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-cta-with-stats-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PRowComponent,
    PButtonComponent,
    PLinkComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="max-w-2xl lg:max-w-4xl">
        <bkit-stack [config]="getStackConfig()">
          <bkit-text
            [config]="{
              tag: 'h2',
              content: getTitle(),
              size: '4xl',
              weight: 'bold',
              align: 'center',
              color: 'white'
            }"
          ></bkit-text>
          <bkit-text
            [config]="{
              tag: 'p',
              content: getDescription(),
              size: 'lg',
              align: 'center',
              color: getDescriptionColor()
            }"
          ></bkit-text>
          <div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (stat of getStats(); track $index) {
              <bkit-stack [config]="{ gap: 'sm', alignItems: 'start' }">
                <bkit-text
                  [config]="{ tag: 'div', content: stat.label, size: 'base', weight: 'semibold', color: getStatLabelColor() }"
                ></bkit-text>
                <div class="flex items-baseline gap-x-2">
                  <bkit-text
                    [config]="{ tag: 'div', content: stat.value, size: '3xl', weight: 'semibold', color: 'white' }"
                  ></bkit-text>
                  @if (stat.suffix) {
                    <bkit-text
                      [config]="{ tag: 'div', content: stat.suffix, size: 'sm', color: getStatLabelColor() }"
                    ></bkit-text>
                  }
                </div>
              </bkit-stack>
            }
          </div>
          <bkit-row [config]="getButtonsRowConfig()">
            @if (getPrimaryButtonText()) {
              <bkit-button
                [config]="{
                  href: getPrimaryButtonLink(),
                  variant: 'secondary',
                  size: 'md',
                  text: getPrimaryButtonText(),
                  ariaLabel: getPrimaryButtonText(),
                  class: getPrimaryButtonClasses()
                }"
              ></bkit-button>
            }
            @if (getSecondaryButtonText()) {
              <bkit-link
                [config]="{
                  href: getSecondaryButtonLink(),
                  text: getSecondaryButtonText() + ' →',
                  variant: 'primary',
                  ariaLabel: getSecondaryButtonText(),
                  class: getSecondaryButtonClasses()
                }"
              ></bkit-link>
            }
          </bkit-row>
        </bkit-stack>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class CtaWithStatsPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getDescriptionColor(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `${primaryBase}-200`;
  }

  getStatLabelColor(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `${primaryBase}-200`;
  }

  getPrimaryButtonClasses(): string[] {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-50';
    return ['shrink-0', `!bg-white`, `!text-${primary}`, `hover:!bg-${primaryMuted}`];
  }

  getSecondaryButtonClasses(): string[] {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return ['shrink-0', 'whitespace-nowrap', '!text-white', `hover:!text-${primaryBase}-100`];
  }

  getSectionBgClasses(): string[] {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return [`bg-${primary}`, `dark:bg-${primaryBase}-900`];
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: 'dark' as const,
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      maxWidth: 'full' as const,
      animateOnScroll: true,
      class: [
        ...this.getSectionBgClasses(),
        ...(this.config?.classes ?? [])
      ] as string[]
    };
  }

  getStackConfig() {
    const d = this.getData();
    return {
      gap: (d['gap'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg' | 'xl',
      alignItems: 'center' as const,
      class: [] as string[]
    };
  }

  getButtonsRowConfig() {
    const d = this.getData();
    return {
      gap: (d['buttonGap'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg' | 'xl',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      wrap: false,
      class: [] as string[]
    };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Ready to get started?';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || 'Join thousands of satisfied customers.';
  }

  getPrimaryButtonText(): string {
    return (this.getData()['primaryButtonText'] as string) || 'Get started';
  }

  getPrimaryButtonLink(): string {
    return (this.getData()['primaryButtonLink'] as string) || '#';
  }

  getSecondaryButtonText(): string {
    return (this.getData()['secondaryButtonText'] as string) || 'Learn more';
  }

  getSecondaryButtonLink(): string {
    return (this.getData()['secondaryButtonLink'] as string) || '#';
  }

  getStats(): Array<{ label: string; value: string; suffix?: string }> {
    return (this.getData()['stats'] as Array<{ label: string; value: string; suffix?: string }>) || [
      { label: 'Active users', value: '10K', suffix: '+' },
      { label: 'Companies', value: '500', suffix: '+' },
      { label: 'Countries', value: '50', suffix: '+' },
      { label: 'Uptime', value: '99.9', suffix: '%' }
    ];
  }
}
