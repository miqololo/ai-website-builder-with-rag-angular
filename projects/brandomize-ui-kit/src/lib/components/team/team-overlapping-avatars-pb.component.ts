import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-team-overlapping-avatars-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-xl">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl" [ngClass]="getIconBackgroundClasses()">
            <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="mt-6">
            <bkit-text
              [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"
            ></bkit-text>
          </div>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"
          ></bkit-text>
        </div>
        <div class="flex -space-x-4">
          @for (member of getMembers(); track member.name) {
            <div [class]="getAvatarRingClasses()" [ngClass]="getAvatarRingHoverClasses()">
              <img [src]="member.image" [alt]="member.name" class="h-16 w-16 object-cover sm:h-20 sm:w-20" />
            </div>
          }
        </div>
      </div>
      <div class="mt-12 flex flex-wrap justify-center gap-x-6 gap-y-4">
        @for (member of getMembers(); track member.name) {
          <div [class]="getCardClasses()" [ngClass]="getCardHoverClasses()">
            <img [src]="member.image" [alt]="member.name" class="h-10 w-10 rounded-full object-cover" />
            <div>
              <div [class]="getMemberNameClasses()">{{ member.name }}</div>
              <div [class]="getMemberRoleClasses()">{{ member.role }}</div>
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TeamOverlappingAvatarsPbComponent {
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

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Our team';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Meet the people building the future.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getMembers(): Array<{ name: string; role: string; image: string }> {
    return (this.getData()['members'] as Array<{ name: string; role: string; image: string }>) || [
      { name: 'Leslie Alexander', role: 'CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
      { name: 'Michael Foster', role: 'CTO', image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face' },
      { name: 'Dries Vincent', role: 'Designer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
      { name: 'Lindsay Walton', role: 'Engineer', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face' }
    ];
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `bg-${primaryBase}-100 text-${primary} dark:bg-${primaryBase}-500/20 dark:text-${primaryBase}-400`;
  }

  getAvatarRingHoverClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `hover:ring-${primaryBase}-200 dark:hover:ring-${primaryBase}-500/50`;
  }

  getCardHoverClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `hover:border-${primaryBase}-200 dark:hover:border-${primaryBase}-500/30`;
  }

  getAvatarRingClasses(): string {
    const t = this.theme.themeResolved();
    const background = t.colors?.background ?? 'white';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `overflow-hidden rounded-full ring-4 ring-${background} transition-all duration-500 hover:z-10 hover:scale-110 dark:ring-${surfaceDark}`;
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `flex items-center gap-3 rounded-xl border border-${border} bg-${surfaceMuted} px-4 py-3 transition-all hover:shadow-md dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark}`;
  }

  getMemberNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `font-semibold text-${text} dark:text-white`;
  }

  getMemberRoleClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-sm text-${textMutedLight} dark:text-gray-400`;
  }
}
