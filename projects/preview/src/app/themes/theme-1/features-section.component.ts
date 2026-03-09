import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@Component({
  selector: 'theme1-features-section',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section class="py-16 sm:py-20 lg:py-24 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12 sm:mb-16" theme1ScrollAnimate>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {{ getTitle() }}
          </h2>
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {{ getSubtitle() }}
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div
            *ngFor="let feature of getFeatures(); let i = index"
            theme1ScrollAnimate
            class="group relative bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            [style.animation-delay.ms]="i * 100"
          >
            <!-- Icon -->
            <div class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" [innerHTML]="getIconSvg(feature.icon)"></svg>
            </div>

            <!-- Title -->
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {{ feature.title }}
            </h3>

            <!-- Description -->
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ feature.description }}
            </p>

            <!-- Decorative element -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    [theme1ScrollAnimate] {
      opacity: 0;
      transform: translateY(30px);
    }
    .scroll-animate-hidden {
      opacity: 0 !important;
      transform: translateY(30px) !important;
    }
    .scroll-animate-visible {
      animation: fade-in-up 0.6s ease-out forwards;
    }
  `]
})
export class FeaturesSectionComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Why Choose Our Platform';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Everything you need to succeed in your learning journey';
  }

  getIconSvg(iconName: string): string {
    const icons: Record<string, string> = {
      video: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>`,
      certificate: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>`,
      support: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>`,
      mobile: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>`,
      community: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>`,
      lifetime: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>`
    };
    return icons[iconName] || icons['video'];
  }

  getFeatures(): Array<{
    title: string;
    description: string;
    icon: string;
  }> {
    return (this.getData()['features'] as Array<any>) || [
      {
        title: 'Video-Based Learning',
        description: 'Learn at your own pace with high-quality video lectures from industry experts. Pause, rewind, and rewatch as needed.',
        icon: 'video'
      },
      {
        title: 'Certificates of Completion',
        description: 'Earn verifiable certificates that you can share on LinkedIn and add to your resume to showcase your skills.',
        icon: 'certificate'
      },
      {
        title: '24/7 Support',
        description: 'Get help whenever you need it. Our support team and community are always ready to assist you.',
        icon: 'support'
      },
      {
        title: 'Mobile-Friendly',
        description: 'Access your courses anywhere, anytime. Our platform works seamlessly on all devices - desktop, tablet, and mobile.',
        icon: 'mobile'
      },
      {
        title: 'Active Community',
        description: 'Join thousands of learners in our community. Share projects, ask questions, and network with peers.',
        icon: 'community'
      },
      {
        title: 'Lifetime Access',
        description: 'Once you enroll, you get lifetime access to course materials, including future updates and new content.',
        icon: 'lifetime'
      }
    ];
  }
}
