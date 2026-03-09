import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-how-it-works-numbered-circles-pb',
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
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: 'white' }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 sm:grid-cols-3">
        @for (step of getSteps(); track $index) {
          <div class="flex flex-col items-center text-center">
            <div class="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/20 text-4xl font-bold text-white shadow-2xl backdrop-blur-sm ring-4 ring-white/30">
              <span class="relative z-10">{{ $index + 1 }}</span>
            </div>
            <h3 class="mt-6 text-xl font-semibold text-white">{{ step.title }}</h3>
            <p [class]="getStepDescClasses()">{{ step.description }}</p>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class HowItWorksNumberedCirclesPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: 'default' as const,
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: [
        'relative overflow-hidden',
        ...this.getSectionGradientClasses(),
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

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `${primaryBase}-100`;
  }

  getSectionGradientClasses(): string[] {
    const heroGradient = this.theme.getGradientClass('hero');
    return [heroGradient.split(' ').map(c => '!' + c).join(' ')];
  }

  getStepDescClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-2 text-${primaryBase}-100`;
  }

  getSteps(): Array<{ title: string; description: string }> {
    return (this.getData()['steps'] as Array<{ title: string; description: string }>) || [
      { title: 'Sign up', description: 'Create your account in seconds.' },
      { title: 'Configure', description: 'Set up your project in minutes.' },
      { title: 'Deploy', description: 'Go live with one click.' }
    ];
  }
}
