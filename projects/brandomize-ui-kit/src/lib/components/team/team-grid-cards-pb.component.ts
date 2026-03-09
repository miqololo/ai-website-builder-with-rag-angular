import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-team-grid-cards-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PImageComponent
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
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
        @for (member of getMembers(); track member.name) {
          <div class="group">
            <div [class]="getImageWrapperClasses()">
              <bkit-image
                [config]="{
                  src: member.image,
                  alt: member.name,
                  objectFit: 'cover',
                  rounded: 'xl',
                  class: ['h-full w-full transition-transform duration-500 group-hover:scale-110']
                }"
              ></bkit-image>
            </div>
            <div class="mt-4 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300" [ngClass]="getIconBackgroundClasses()">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 [class]="getMemberNameClasses()">{{ member.name }}</h3>
                <p class="text-sm" [ngClass]="getRoleColorClasses()">{{ member.role }}</p>
              </div>
            </div>
            @if (member.bio) {
              <p [class]="getMemberBioClasses()">{{ member.bio }}</p>
            }
            @if (member.linkedin || member.github || member.email) {
              <div class="mt-4 flex gap-2">
                @if (member.linkedin) {
                  <a [href]="member.linkedin" target="_blank" rel="noopener noreferrer" [ngClass]="getLinkClasses()">LinkedIn</a>
                }
                @if (member.github) {
                  <a [href]="member.github" target="_blank" rel="noopener noreferrer" [ngClass]="getLinkClasses()">GitHub</a>
                }
                @if (member.email) {
                  <a [href]="'mailto:' + member.email" [ngClass]="getLinkClasses()">Email</a>
                }
              </div>
            }
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TeamGridCardsPbComponent {
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
    return (this.getData()['title'] as string) || 'Our team';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'The people behind our product.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getMembers(): Array<{ name: string; role: string; image: string; bio?: string; email?: string; linkedin?: string; github?: string }> {
    return (this.getData()['members'] as Array<{ name: string; role: string; image: string; bio?: string; email?: string; linkedin?: string; github?: string }>) || [
      { name: 'Leslie Alexander', role: 'Co-Founder / CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', bio: '10+ years in product.', email: 'leslie@example.com', linkedin: '#' },
      { name: 'Michael Foster', role: 'Co-Founder / CTO', image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face', bio: 'Former staff engineer at Google.', github: '#' },
      { name: 'Dries Vincent', role: 'Designer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', bio: 'Design systems expert.', linkedin: '#', github: '#' }
    ];
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `bg-${primaryBase}-100 text-${primary} group-hover:bg-${primary} group-hover:text-white dark:bg-${primaryBase}-500/20 dark:text-${primaryBase}-400 dark:group-hover:bg-${primaryBase}-500 dark:group-hover:text-white`;
  }

  getRoleColorClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primary} dark:text-${primaryBase}-400`;
  }

  getLinkHoverClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `hover:text-${primary} dark:hover:text-${primaryBase}-400`;
  }

  getImageWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `aspect-square overflow-hidden rounded-2xl bg-${surfaceMuted} transition-all duration-500 group-hover:shadow-xl dark:bg-${surfaceMutedDark}`;
  }

  getMemberNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `font-semibold text-${text} dark:text-white`;
  }

  getMemberBioClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm text-${textMuted} dark:text-gray-300`;
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return `text-${textMutedLight} ${this.getLinkHoverClasses()}`;
  }
}
