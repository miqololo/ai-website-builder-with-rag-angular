import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { TeamSocialLinksPbComponent, TeamSocialLinksPb } from './team-social-links-pb.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-team-alternating-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PImageComponent,
    TeamSocialLinksPbComponent
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
      <div class="mx-auto mt-16 max-w-5xl space-y-24">
        @for (member of getMembers(); track member.name) {
          <div class="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16" [class.lg:flex-row-reverse]="$index % 2 === 1">
            <div class="flex-1">
              <div [class]="getImageWrapperClasses()">
                <bkit-image
                  [config]="{
                    src: member.image,
                    alt: member.name,
                    objectFit: 'cover',
                    rounded: 'none',
                    class: ['h-full w-full transition-transform duration-500 hover:scale-105']
                  }"
                ></bkit-image>
              </div>
            </div>
            <div class="flex-1">
              @if (member.quote) {
                <div class="flex gap-3">
                  <svg [class]="getQuoteIconClasses()" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.998 3.638-3.998 5.849h3.983v10h-9.981z"/>
                  </svg>
                  <blockquote [class]="getQuoteClasses()">
                    {{ member.quote }}
                  </blockquote>
                </div>
              }
              <h3 [class]="getMemberNameClasses()">{{ member.name }}</h3>
              <p [class]="getMemberRoleClasses()">{{ member.role }}</p>
              @if (member.bio) {
                <p [class]="getMemberBioClasses()">{{ member.bio }}</p>
              }
              <div class="mt-6">
                <bkit-team-social-links-pb [links]="getSocialLinks(member)" [iconSize]="20"></bkit-team-social-links-pb>
              </div>
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TeamAlternatingPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  getSocialLinks(member: { email?: string; linkedin?: string; github?: string; twitter?: string; instagram?: string; youtube?: string }): TeamSocialLinksPb {
    return {
      email: member.email,
      linkedin: member.linkedin,
      github: member.github,
      twitter: member.twitter,
      instagram: member.instagram,
      youtube: member.youtube
    };
  }

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

  getImageWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `aspect-square max-w-md overflow-hidden rounded-2xl bg-${surfaceMuted} shadow-xl dark:bg-${surfaceMutedDark}`;
  }

  getQuoteIconClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    return `h-7 w-7 flex-shrink-0 text-${primary} dark:text-indigo-400`;
  }

  getQuoteClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-700';
    return `text-xl font-medium italic text-${text} dark:text-gray-300`;
  }

  getMemberNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-6 text-2xl font-bold text-${text} dark:text-white`;
  }

  getMemberRoleClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    return `text-${primary} dark:text-indigo-400`;
  }

  getMemberBioClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-4 text-${textMuted} dark:text-gray-300`;
  }

  getMembers(): Array<{ name: string; role: string; image: string; bio?: string; quote?: string; email?: string; linkedin?: string; github?: string; twitter?: string; instagram?: string; youtube?: string }> {
    return (this.getData()['members'] as Array<{ name: string; role: string; image: string; bio?: string; quote?: string; email?: string; linkedin?: string; github?: string; twitter?: string; instagram?: string; youtube?: string }>) || [
      { name: 'Leslie Alexander', role: 'Co-Founder / CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face', bio: '10+ years building products that users love.', quote: 'We believe in building tools that empower teams.' },
      { name: 'Michael Foster', role: 'Co-Founder / CTO', image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=600&h=600&fit=crop&crop=face', bio: 'Former staff engineer at Google. Passionate about scale and reliability.', quote: 'Great software is invisible—it just works.' }
    ];
  }
}
