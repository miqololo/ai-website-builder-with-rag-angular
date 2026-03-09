import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-how-it-works-with-icons-pb',
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
      <div class="mx-auto mt-16 max-w-4xl">
        <div class="grid grid-cols-1 gap-12 sm:grid-cols-3">
          @for (step of getSteps(); track $index) {
            <div class="group relative">
              @if ($index < getSteps().length - 1) {
                <div [class]="getConnectorLineClasses()" aria-hidden="true"></div>
              }
              <div class="relative flex flex-col items-center text-center">
                <div [class]="getIconBoxClasses()">
                  <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span [class]="getStepLabelClasses()">Step {{ $index + 1 }}</span>
                <h3 [class]="getStepTitleClasses()">{{ step.title }}</h3>
                <p [class]="getStepDescClasses()">{{ step.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class HowItWorksWithIconsPbComponent {
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

  getConnectorLineClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `absolute left-[100%] top-12 hidden h-px w-full -translate-x-1/2 bg-gradient-to-r from-${primaryBase}-200 to-transparent sm:block`;
  }

  getIconBoxClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-100';
    return `flex h-20 w-20 items-center justify-center rounded-2xl bg-${primaryMuted} text-${primary} transition-all duration-500 group-hover:scale-110 group-hover:bg-${primary} group-hover:text-white dark:bg-${primaryBase}-500/20 dark:text-${primaryBase}-400 dark:group-hover:bg-${primaryBase}-500`;
  }

  getStepLabelClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-2 text-sm font-bold text-${primary} dark:text-${primaryBase}-400`;
  }

  getStepTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-2 text-lg font-semibold text-${text} dark:text-white`;
  }

  getStepDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm text-${textMuted} dark:text-gray-300`;
  }

  getSteps(): Array<{ title: string; description: string; icon?: string }> {
    return (this.getData()['steps'] as Array<{ title: string; description: string; icon?: string }>) || [
      { title: 'Sign up', description: 'Create your account in seconds.' },
      { title: 'Configure', description: 'Set up your project in minutes.' },
      { title: 'Deploy', description: 'Go live with one click.' }
    ];
  }
}
