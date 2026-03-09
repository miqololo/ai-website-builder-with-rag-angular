import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-how-it-works-bento-steps-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div class="relative mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="relative mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:mt-20 lg:grid-cols-3 lg:grid-rows-2">
        @for (step of getSteps(); track $index) {
          <div
            [class]="getCardClasses()"
            [class.lg:col-span-2]="$index === 0"
            [class.lg:row-span-2]="$index === 0"
          >
            <div [class]="getBlobGradientClasses()" class="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-60"></div>
            <div class="relative">
              <div [class]="getIconBoxClasses()">
                {{ $index + 1 }}
              </div>
              <h3 [class]="getStepTitleClasses()">{{ step.title }}</h3>
              <p [class]="getStepDescClasses()" [class.lg:text-base]="$index === 0">{{ step.description }}</p>
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class HowItWorksBentoStepsPbComponent {
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
      class: [
        'relative overflow-hidden',
        ...this.getSectionBgClasses(),
        ...(this.config?.classes ?? [])
      ] as string[]
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

  getBlobGradientClasses(): string {
    return this.theme.getGradientClass('card');
  }

  getSectionBgClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return [`!bg-${surfaceMuted}`, `dark:!bg-${surfaceBase}-950`];
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `group relative overflow-hidden rounded-2xl border border-${border} bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-${primaryBase}-200 hover:shadow-xl dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:hover:border-${primaryBase}-500/30`;
  }

  getIconBoxClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${primary} text-xl font-bold text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 dark:bg-${primaryBase}-500`;
  }

  getStepTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold text-${text} dark:text-white`;
  }

  getStepDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-${textMuted} dark:text-gray-300`;
  }

  getSteps(): Array<{ title: string; description: string }> {
    return (this.getData()['steps'] as Array<{ title: string; description: string }>) || [
      { title: 'Sign up', description: 'Create your account in less than a minute. No credit card required. Customize your profile and preferences.' },
      { title: 'Configure', description: 'Customize your workspace and connect your favorite tools.' },
      { title: 'Launch', description: 'Start collaborating with your team right away.' }
    ];
  }
}
