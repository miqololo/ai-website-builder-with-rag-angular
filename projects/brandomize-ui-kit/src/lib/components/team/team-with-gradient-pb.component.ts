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
  selector: 'bkit-team-with-gradient-pb',
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
      <div class="absolute inset-0"></div>
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
      <div class="relative mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
        @for (member of getMembers(); track member.name) {
          <div class="group">
            <div class="rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/20">
              <div class="aspect-square overflow-hidden rounded-xl">
                <bkit-image
                  [config]="{
                    src: member.image,
                    alt: member.name,
                    objectFit: 'cover',
                    rounded: 'none',
                    class: ['h-full w-full transition-transform duration-500 group-hover:scale-105']
                  }"
                ></bkit-image>
              </div>
              <h3 class="mt-4 text-lg font-semibold text-white">{{ member.name }}</h3>
              <p [class]="getMemberRoleClasses()">{{ member.role }}</p>
              @if (member.bio) {
                <p [class]="getMemberBioClasses()">{{ member.bio }}</p>
              }
              <div class="mt-4 [&_a]:!text-white/80 [&_a:hover]:!text-white">
                <bkit-team-social-links-pb [links]="getSocialLinks(member)" [iconSize]="16"></bkit-team-social-links-pb>
              </div>
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TeamWithGradientPbComponent {
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

  getSectionGradientClasses(): string[] {
    const heroGradient = this.theme.getGradientClass('hero');
    return [heroGradient.split(' ').map(c => '!' + c).join(' ')];
  }

  getTitleColor(): string {
    return 'white';
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.primaryMuted ?? 'indigo-100');
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Our team';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'The people behind our product.';
  }

  getMemberRoleClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primaryBase}-200`;
  }

  getMemberBioClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-2 text-sm text-${primaryBase}-100`;
  }

  getMembers(): Array<{ name: string; role: string; image: string; bio?: string; email?: string; linkedin?: string; github?: string; twitter?: string; instagram?: string; youtube?: string }> {
    return (this.getData()['members'] as Array<{ name: string; role: string; image: string; bio?: string; email?: string; linkedin?: string; github?: string; twitter?: string; instagram?: string; youtube?: string }>) || [
      { name: 'Leslie Alexander', role: 'Co-Founder / CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', bio: '10+ years in product.' },
      { name: 'Michael Foster', role: 'Co-Founder / CTO', image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face', bio: 'Former staff engineer.' },
      { name: 'Dries Vincent', role: 'Designer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', bio: 'Design systems expert.' }
    ];
  }
}
