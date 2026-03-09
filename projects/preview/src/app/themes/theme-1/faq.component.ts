import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@Component({
  selector: 'theme1-faq',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section class="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12 sm:mb-16" theme1ScrollAnimate>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {{ getTitle() }}
          </h2>
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {{ getSubtitle() }}
          </p>
        </div>

        <!-- FAQ Items -->
        <div class="space-y-4">
          <div
            *ngFor="let faq of getFaqs(); let i = index"
            theme1ScrollAnimate
            class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:via-indigo-900/20 dark:hover:to-purple-900/20"
            [style.animation-delay.ms]="i * 50"
          >
            <button
              type="button"
              (click)="toggleFaq(i)"
              class="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <span class="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                {{ faq.question }}
              </span>
              <svg
                class="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent transform transition-transform duration-200"
                [class.rotate-180]="openFaqs[i]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              *ngIf="openFaqs[i]"
              class="px-6 pb-5 animate-slide-down"
            >
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                {{ faq.answer }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes slide-down {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 500px;
      }
    }
    [theme1ScrollAnimate] {
      opacity: 0;
      transform: translateY(20px);
    }
    .scroll-animate-hidden {
      opacity: 0 !important;
      transform: translateY(20px) !important;
    }
    .scroll-animate-visible {
      animation: fade-in-up 0.5s ease-out forwards;
    }
    .animate-slide-down {
      animation: slide-down 0.3s ease-out;
    }
  `]
})
export class FaqComponent {
  @Input() config?: ComponentConfig;
  openFaqs: Record<number, boolean> = {};

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  toggleFaq(index: number): void {
    this.openFaqs[index] = !this.openFaqs[index];
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Frequently Asked Questions';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Find answers to common questions about our platform and courses';
  }

  getFaqs(): Array<{ question: string; answer: string }> {
    return (this.getData()['faqs'] as Array<{ question: string; answer: string }>) || [
      {
        question: 'How do I enroll in a course?',
        answer: 'Simply browse our course catalog, select the course you\'re interested in, and click "Enroll Now". You can start learning immediately after enrollment. All courses include lifetime access, so you can learn at your own pace.'
      },
      {
        question: 'Do I get a certificate after completing a course?',
        answer: 'Yes! Upon successful completion of a course, you\'ll receive a verifiable certificate that you can share on LinkedIn, add to your resume, or include in your portfolio. Our certificates are recognized by industry professionals.'
      },
      {
        question: 'Can I access courses on mobile devices?',
        answer: 'Absolutely! Our platform is fully responsive and works seamlessly on desktop, tablet, and mobile devices. You can download our mobile app or access courses directly through your mobile browser.'
      },
      {
        question: 'What if I need help during a course?',
        answer: 'We offer 24/7 support through our community forums, direct messaging with instructors, and our support team. You can also join study groups and connect with other learners for peer support.'
      },
      {
        question: 'Are there any prerequisites for courses?',
        answer: 'Most courses are designed for beginners, but some advanced courses may have prerequisites. These are clearly listed on each course page. We also offer learning paths to help you progress from beginner to advanced levels.'
      },
      {
        question: 'Can I get a refund if I\'m not satisfied?',
        answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with your course for any reason, contact our support team within 30 days of enrollment for a full refund.'
      }
    ];
  }
}
