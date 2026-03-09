import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@Component({
  selector: 'theme1-footer',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <footer class="bg-gray-900 dark:bg-black text-gray-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <!-- Brand Column -->
          <div class="lg:col-span-1">
            <h3 class="text-2xl font-bold text-white mb-4">{{ getBrandName() }}</h3>
            <p class="text-gray-400 mb-6 leading-relaxed">
              {{ getBrandDescription() }}
            </p>
            <!-- Social Links -->
            <div class="flex space-x-4">
              <a
                *ngFor="let social of getSocialLinks()"
                [href]="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-800 dark:bg-gray-900 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                [attr.aria-label]="social.name"
              >
                <span [innerHTML]="getSocialIcon(social.name)" class="w-5 h-5 text-white"></span>
              </a>
            </div>
          </div>

          <!-- Links Columns -->
          <div *ngFor="let column of getFooterColumns(); let i = index" theme1ScrollAnimate [style.animation-delay.ms]="i * 100">
            <h4 class="text-white font-semibold mb-4">{{ column.title }}</h4>
            <ul class="space-y-3">
              <li *ngFor="let link of column.links">
                <a
                  [href]="link.url"
                  class="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Newsletter -->
        <div class="mt-12 pt-8 border-t border-gray-800">
          <div class="max-w-md">
            <h4 class="text-white font-semibold mb-4">{{ getNewsletterTitle() }}</h4>
            <p class="text-gray-400 mb-4">{{ getNewsletterDescription() }}</p>
            <div class="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-4 py-3 rounded-lg bg-gray-800 dark:bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                (click)="onNewsletterSubmit()"
                class="primary-btn-footer px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                (mouseleave)="onFooterButtonLeave($event)"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            {{ getCopyrightText() }}
          </p>
          <div class="mt-4 sm:mt-0 flex flex-wrap gap-6">
            <a
              *ngFor="let link of getBottomLinks()"
              [href]="link.url"
              class="text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              {{ link.label }}
            </a>
          </div>
        </div>
      </div>
    </footer>
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
    [theme1ScrollAnimate] {
      opacity: 0;
      transform: translateY(20px);
    }
    .scroll-animate-hidden {
      opacity: 0 !important;
      transform: translateY(20px) !important;
    }
    .scroll-animate-visible {
      animation: fade-in-up 0.6s ease-out forwards;
    }
    @keyframes fade-out-in {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0;
        transform: scale(0.95);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    .primary-btn-footer {
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .primary-btn-footer:hover {
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .primary-btn-footer.fade-out-in {
      animation: fade-out-in 0.6s ease-in-out;
    }
  `]
})
export class FooterComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  onFooterButtonLeave(event: Event): void {
    const button = event.target as HTMLElement;
    button.classList.add('fade-out-in');
    setTimeout(() => {
      button.classList.remove('fade-out-in');
    }, 600);
  }

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  onNewsletterSubmit(): void {
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
  }

  getBrandName(): string {
    return (this.getData()['brandName'] as string) || 'EduLearn';
  }

  getBrandDescription(): string {
    return (this.getData()['brandDescription'] as string) || 'Transform your future with expert-led courses. Join thousands of students learning new skills.';
  }

  getSocialIcon(name: string): string {
    const icons: Record<string, string> = {
      facebook: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>`,
      twitter: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>`,
      linkedin: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg>`,
      instagram: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>`,
      youtube: `<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>`
    };
    return icons[name.toLowerCase()] || '';
  }

  getSocialLinks(): Array<{ name: string; url: string }> {
    return (this.getData()['socialLinks'] as Array<{ name: string; url: string }>) || [
      { name: 'facebook', url: 'https://facebook.com' },
      { name: 'twitter', url: 'https://twitter.com' },
      { name: 'linkedin', url: 'https://linkedin.com' },
      { name: 'instagram', url: 'https://instagram.com' }
    ];
  }

  getFooterColumns(): Array<{ title: string; links: Array<{ label: string; url: string }> }> {
    return (this.getData()['footerColumns'] as Array<any>) || [
      {
        title: 'Courses',
        links: [
          { label: 'All Courses', url: '#courses' },
          { label: 'Web Development', url: '#web-dev' },
          { label: 'Data Science', url: '#data-science' },
          { label: 'Design', url: '#design' }
        ]
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', url: '#about' },
          { label: 'Instructors', url: '#instructors' },
          { label: 'Careers', url: '#careers' },
          { label: 'Blog', url: '#blog' }
        ]
      },
      {
        title: 'Support',
        links: [
          { label: 'Help Center', url: '#help' },
          { label: 'Contact Us', url: '#contact' },
          { label: 'Privacy Policy', url: '#privacy' },
          { label: 'Terms of Service', url: '#terms' }
        ]
      }
    ];
  }

  getNewsletterTitle(): string {
    return (this.getData()['newsletterTitle'] as string) || 'Stay Updated';
  }

  getNewsletterDescription(): string {
    return (this.getData()['newsletterDescription'] as string) || 'Subscribe to our newsletter to get the latest course updates and learning tips.';
  }

  getCopyrightText(): string {
    return (this.getData()['copyrightText'] as string) || `© ${new Date().getFullYear()} ${this.getBrandName()}. All rights reserved.`;
  }

  getBottomLinks(): Array<{ label: string; url: string }> {
    return (this.getData()['bottomLinks'] as Array<{ label: string; url: string }>) || [
      { label: 'Privacy Policy', url: '#privacy' },
      { label: 'Terms of Service', url: '#terms' },
      { label: 'Cookie Policy', url: '#cookies' }
    ];
  }
}
