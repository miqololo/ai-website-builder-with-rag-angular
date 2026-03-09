import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-how-it-works-horizontal-cards-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
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
      <div class="mx-auto mt-16 max-w-5xl">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
          @for (step of getSteps(); track $index) {
            <div [class]="getCardClasses()">
              <div [class]="getTopBarClasses()"></div>
              <div class="flex h-20 items-center justify-center">
                <div [class]="getNumberBadgeClasses()">
                  {{ $index + 1 }}
                </div>
              </div>
              <div class="flex flex-1 flex-col p-6 pt-0">
                <h3 [class]="getStepTitleClasses()">{{ step.title }}</h3>
                <p [class]="getStepDescClasses()">{{ step.description }}</p>
              </div>
            </div>
          }
        </div>
        <div class="mt-8 flex items-center justify-center gap-2">
          @for (step of getSteps(); track $index) {
            <div
              [class]="getDotClasses()"
              [class.scale-125]="$index === 0"
              [class.opacity-100]="$index === 0"
              [class.opacity-50]="$index !== 0"
            ></div>
            @if ($index < getSteps().length - 1) {
              <div [class]="getDividerClasses()"></div>
            }
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class HowItWorksHorizontalCardsPbComponent {
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
    return (this.getData()['title'] as string) || 'How it works';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Get started in three simple steps.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `group relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-${border} bg-${surfaceMuted} transition-all duration-500 hover:-translate-y-2 hover:border-${primaryBase}-200 hover:shadow-xl hover:shadow-${primaryBase}-500/10 dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:hover:border-${primaryBase}-500/30`;
  }

  getTopBarClasses(): string {
    const heroGradient = this.theme.getGradientClass('hero');
    return `absolute inset-x-0 top-0 h-1 ${heroGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`;
  }

  getNumberBadgeClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `flex h-14 w-14 items-center justify-center rounded-2xl bg-${primary} text-2xl font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 dark:bg-${primaryBase}-500`;
  }

  getStepTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold text-${text} dark:text-white`;
  }

  getStepDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 flex-1 text-sm text-${textMuted} dark:text-gray-300`;
  }

  getDotClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `h-2 w-2 rounded-full bg-${primary} transition-all duration-500 dark:bg-${primaryBase}-500`;
  }

  getDividerClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `h-px w-8 bg-${border} dark:bg-${borderMutedDark}`;
  }

  getSteps(): Array<{ title: string; description: string; icon?: string }> {
    return (this.getData()['steps'] as Array<{ title: string; description: string; icon?: string }>) || [
      { title: 'Sign up', description: 'Create your account in less than a minute. No credit card required.' },
      { title: 'Configure', description: 'Customize your workspace and connect your favorite tools.' },
      { title: 'Launch', description: 'Start collaborating with your team right away.' }
    ];
  }
}
