import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PRowComponent } from '@brandomize/primitives/p-row/p-row.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-cta-split-pb',
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
      <div class="max-w-2xl lg:max-w-none">
        <div class="lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-8">
          <bkit-stack [config]="getContentStackConfig()">
            <bkit-text
              [config]="{
                tag: 'h2',
                content: getTitle(),
                size: '4xl',
                weight: 'bold',
                color: getTitleColor()
              }"
            ></bkit-text>
            <bkit-text
              [config]="{
                tag: 'p',
                content: getDescription(),
                size: 'lg',
                color: getDescriptionColor()
              }"
            ></bkit-text>
            <bkit-row [config]="getButtonsRowConfig()">
              @if (getPrimaryButtonText()) {
                <bkit-button
                  [config]="{
                    href: getPrimaryButtonLink(),
                    variant: 'primary',
                    size: 'md',
                    text: getPrimaryButtonText(),
                    ariaLabel: getPrimaryButtonText(),
                    class: ['shrink-0']
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
                    class: ['shrink-0', 'whitespace-nowrap']
                  }"
                ></bkit-link>
              }
            </bkit-row>
          </bkit-stack>
          <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0">
            @for (stat of getStats(); track $index) {
              <bkit-stack [config]="{ gap: 'sm', alignItems: 'start' }">
                <bkit-text
                  [config]="{ tag: 'dt', content: stat.label, size: 'sm', color: getDescriptionColor() }"
                ></bkit-text>
                <bkit-text
                  [config]="{ tag: 'dd', content: stat.value, size: '3xl', weight: 'bold', color: getTitleColor() }"
                ></bkit-text>
              </bkit-stack>
            }
          </div>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class CtaSplitPbComponent {
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
      maxWidth: 'full' as const,
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getContentStackConfig() {
    const d = this.getData();
    return {
      gap: (d['gap'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg' | 'xl',
      alignItems: 'start' as const,
      class: [] as string[]
    };
  }

  getButtonsRowConfig() {
    const d = this.getData();
    return {
      gap: (d['buttonGap'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg' | 'xl',
      justifyContent: 'start' as const,
      alignItems: 'center' as const,
      wrap: false,
      class: [] as string[]
    };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Boost your productivity';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || 'Start building amazing products today with our platform.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getDescriptionColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['descriptionColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
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

  getStats(): Array<{ label: string; value: string }> {
    return (this.getData()['stats'] as Array<{ label: string; value: string }>) || [
      { label: 'Active users', value: '10K+' },
      { label: 'Companies', value: '500+' },
      { label: 'Countries', value: '50+' },
      { label: 'Uptime', value: '99.9%' }
    ];
  }
}
