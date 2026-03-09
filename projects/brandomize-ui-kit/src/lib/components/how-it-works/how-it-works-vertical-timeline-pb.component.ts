import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-how-it-works-vertical-timeline-pb',
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
      <div class="mx-auto mt-16 max-w-3xl">
        <div class="relative">
          <div [class]="getTimelineLineClasses()" aria-hidden="true"></div>
          <div class="space-y-12">
            @for (step of getSteps(); track $index) {
              <div class="relative flex gap-8">
                <div [class]="getNumberCircleClasses()">
                  {{ $index + 1 }}
                </div>
                <div [class]="getCardClasses()">
                  <h3 [class]="getStepTitleClasses()">{{ step.title }}</h3>
                  <p [class]="getStepDescClasses()">{{ step.description }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class HowItWorksVerticalTimelinePbComponent {
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

  getTimelineLineClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `absolute left-8 top-0 bottom-0 w-0.5 bg-${border} dark:bg-${borderMutedDark}`;
  }

  getNumberCircleClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-${primary} text-xl font-bold text-white shadow-lg shadow-${primaryBase}-500/30 ring-4 ring-white dark:ring-${surfaceDark} dark:bg-${primaryBase}-500`;
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `min-w-0 flex-1 rounded-2xl border border-${border} bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-${primaryBase}-200 hover:shadow-lg dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:hover:border-${primaryBase}-500/30`;
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

  getSteps(): Array<{ title: string; description: string; icon?: string }> {
    return (this.getData()['steps'] as Array<{ title: string; description: string; icon?: string }>) || [
      { title: 'Sign up', description: 'Create your account in less than a minute. No credit card required.' },
      { title: 'Configure', description: 'Customize your workspace and connect your favorite tools.' },
      { title: 'Launch', description: 'Start collaborating with your team right away.' }
    ];
  }
}
