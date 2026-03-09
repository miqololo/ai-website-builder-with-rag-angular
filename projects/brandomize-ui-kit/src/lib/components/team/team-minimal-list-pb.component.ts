import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-team-minimal-list-pb',
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
      <div class="mx-auto mt-16 max-w-2xl">
        <div [class]="getListClasses()">
          @for (member of getMembers(); track member.name) {
            <div [class]="getRowClasses()">
              <div [class]="getAvatarWrapperClasses()" [ngClass]="getAvatarRingHoverClasses()">
                <bkit-image
                  [config]="{
                    src: member.image,
                    alt: member.name,
                    objectFit: 'cover',
                    rounded: 'full',
                    class: ['h-full w-full transition-transform duration-300 group-hover:scale-105']
                  }"
                ></bkit-image>
              </div>
              <div class="min-w-0 flex-1">
                <h3 [class]="getMemberNameClasses()">{{ member.name }}</h3>
                <p class="text-sm" [ngClass]="getRoleColorClasses()">{{ member.role }}</p>
                @if (member.bio) {
                  <p [class]="getMemberBioClasses()">{{ member.bio }}</p>
                }
              </div>
              <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:opacity-100" [ngClass]="getIconBackgroundClasses()">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TeamMinimalListPbComponent {
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

  getMembers(): Array<{ name: string; role: string; image: string; bio?: string }> {
    return (this.getData()['members'] as Array<{ name: string; role: string; image: string; bio?: string }>) || [
      { name: 'Leslie Alexander', role: 'Co-Founder / CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', bio: '10+ years in product.' },
      { name: 'Michael Foster', role: 'Co-Founder / CTO', image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face', bio: 'Former staff engineer at Google.' },
      { name: 'Dries Vincent', role: 'Designer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', bio: 'Design systems expert.' }
    ];
  }

  getRoleColorClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primary} dark:text-${primaryBase}-400`;
  }

  getAvatarRingHoverClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `group-hover:ring-${primaryBase}-200 dark:group-hover:ring-${primaryBase}-500/50`;
  }

  getListClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `divide-y divide-${border} dark:divide-${borderMutedDark}`;
  }

  getRowClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `group flex items-center gap-6 py-8 transition-colors hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}/50`;
  }

  getAvatarWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-700';
    const borderMuted = t.colors?.borderMuted ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    return `flex h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-${surfaceMuted} ring-2 ring-${borderMuted} transition-all duration-300 dark:bg-${surfaceMutedDark} dark:ring-${borderMutedDark}`;
  }

  getMemberNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `font-semibold text-${text} dark:text-white`;
  }

  getMemberBioClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-1 text-sm text-${textMuted} dark:text-gray-300`;
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `bg-${primaryBase}-100 text-${primary} dark:bg-${primaryBase}-500/20 dark:text-${primaryBase}-400`;
  }
}
