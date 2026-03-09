import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'theme1-header-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header 
      [class]="getHeaderClasses()"
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a [href]="getLogoUrl()" class="flex items-center">
              <span class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {{ getLogoText() }}
              </span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex md:items-center md:space-x-8">
            <a
              *ngFor="let item of getNavItems()"
              [href]="item.url"
              class="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {{ item.label }}
            </a>
          </div>

          <!-- CTA Buttons -->
          <div class="hidden md:flex md:items-center md:space-x-4">
            <a
              [href]="getLoginUrl()"
              class="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {{ getLoginText() }}
            </a>
            <a
              [href]="getSignupUrl()"
              class="primary-btn-nav inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
              (mouseleave)="onNavButtonLeave($event)"
            >
              {{ getSignupText() }}
            </a>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              type="button"
              (click)="toggleMobileMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              [attr.aria-expanded]="mobileMenuOpen"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                *ngIf="!mobileMenuOpen"
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                *ngIf="mobileMenuOpen"
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div
          *ngIf="mobileMenuOpen"
          class="md:hidden pb-4 animate-slide-down"
        >
          <div class="space-y-2 pt-2">
            <a
              *ngFor="let item of getNavItems()"
              [href]="item.url"
              class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
              (click)="closeMobileMenu()"
            >
              {{ item.label }}
            </a>
            <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <a
                [href]="getLoginUrl()"
                class="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                (click)="closeMobileMenu()"
              >
                {{ getLoginText() }}
              </a>
              <a
                [href]="getSignupUrl()"
                class="primary-btn-nav-mobile block px-3 py-2 text-base font-semibold text-center text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 ease-in-out"
                (mouseleave)="onNavButtonLeave($event)"
                (click)="closeMobileMenu()"
              >
                {{ getSignupText() }}
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <!-- Spacer to prevent content from going under fixed header -->
    <div class="h-16 sm:h-20"></div>
  `,
  styles: [`
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slide-down {
      animation: slide-down 0.3s ease-out;
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
    .primary-btn-nav,
    .primary-btn-nav-mobile {
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .primary-btn-nav:hover,
    .primary-btn-nav-mobile:hover {
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .primary-btn-nav.fade-out-in,
    .primary-btn-nav-mobile.fade-out-in {
      animation: fade-out-in 0.6s ease-in-out;
    }
  `]
})
export class HeaderNavbarComponent {
  @Input() config?: ComponentConfig;
  mobileMenuOpen = false;
  isScrolled = false;

  constructor(public theme: ThemeService) {}

  onNavButtonLeave(event: Event): void {
    const button = event.target as HTMLElement;
    button.classList.add('fade-out-in');
    setTimeout(() => {
      button.classList.remove('fade-out-in');
    }, 600);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getHeaderClasses(): string {
    const baseClasses = 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md';
    const scrolledClasses = this.isScrolled ? 'shadow-md' : '';
    return `${baseClasses} ${scrolledClasses}`;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  getLogoText(): string {
    return (this.getData()['logoText'] as string) || 'EduLearn';
  }

  getLogoUrl(): string {
    return (this.getData()['logoUrl'] as string) || '#';
  }

  getNavItems(): Array<{ label: string; url: string }> {
    return (this.getData()['navItems'] as Array<{ label: string; url: string }>) || [
      { label: 'Courses', url: '#courses' },
      { label: 'Instructors', url: '#instructors' },
      { label: 'About', url: '#about' },
      { label: 'Contact', url: '#contact' }
    ];
  }

  getLoginText(): string {
    return (this.getData()['loginText'] as string) || 'Log In';
  }

  getLoginUrl(): string {
    return (this.getData()['loginUrl'] as string) || '#login';
  }

  getSignupText(): string {
    return (this.getData()['signupText'] as string) || 'Sign Up';
  }

  getSignupUrl(): string {
    return (this.getData()['signupUrl'] as string) || '#signup';
  }
}
