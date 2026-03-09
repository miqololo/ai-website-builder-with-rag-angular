import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@Component({
  selector: 'theme1-courses-grid',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section class="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
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

        <!-- Courses Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div
            *ngFor="let course of getCourses(); let i = index"
            theme1ScrollAnimate
            class="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2"
            [style.animation-delay.ms]="i * 100"
          >
            <!-- Course Image -->
            <div class="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
              <img
                [src]="course.image"
                [alt]="course.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onerror="this.style.display='none'"
              />
              <div class="absolute top-4 right-4">
                <span class="px-3 py-1 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm rounded-full">
                  {{ course.level }}
                </span>
              </div>
            </div>

            <!-- Course Content -->
            <div class="p-6 bg-gradient-to-b from-transparent to-blue-50/50 dark:to-blue-900/10 group-hover:relative group-hover:before:absolute group-hover:before:top-0 group-hover:before:left-0 group-hover:before:right-0 group-hover:before:h-1 group-hover:before:bg-gradient-to-r group-hover:before:from-blue-600 group-hover:before:via-indigo-600 group-hover:before:to-purple-600">
              <!-- Category -->
              <div class="flex items-center mb-3">
                <span class="text-xs font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wide">
                  {{ course.category }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ course.title }}
              </h3>

              <!-- Description -->
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {{ course.description }}
              </p>

              <!-- Instructor -->
              <div class="flex items-center mb-4">
                <div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  <img
                    [src]="course.instructorAvatar"
                    [alt]="course.instructor"
                    class="w-full h-full object-cover"
                    (error)="handleImageError($event, course.instructor)"
                  />
                </div>
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ course.instructor }}</span>
              </div>

              <!-- Meta Info -->
              <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                  {{ course.lessons }} Lessons
                </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  {{ course.rating }}
                </div>
              </div>

              <!-- Price and CTA -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ course.price }}</span>
                  <span *ngIf="course.originalPrice" class="text-sm text-gray-500 line-through ml-2">{{ course.originalPrice }}</span>
                </div>
                <a
                  [href]="course.url || '#enroll'"
                  class="primary-btn-enroll px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  (mouseleave)="onEnrollButtonLeave($event)"
                >
                  Enroll Now
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Button -->
        <div class="text-center mt-12">
          <a
            [href]="getViewAllUrl()"
            class="inline-flex items-center px-6 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-600 hover:dark:border-purple-600 transition-all duration-200"
          >
            {{ getViewAllText() }}
            <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
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
    .primary-btn-enroll {
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .primary-btn-enroll:hover {
      transform: scale(1.05);
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .primary-btn-enroll.fade-out-in {
      animation: fade-out-in 0.6s ease-in-out;
    }
  `]
})
export class CoursesGridComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  onEnrollButtonLeave(event: Event): void {
    const button = event.target as HTMLElement;
    button.classList.add('fade-out-in');
    setTimeout(() => {
      button.classList.remove('fade-out-in');
    }, 600);
  }

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Explore Our Courses';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Choose from hundreds of courses taught by industry experts';
  }

  getViewAllText(): string {
    return (this.getData()['viewAllText'] as string) || 'View All Courses';
  }

  getViewAllUrl(): string {
    return (this.getData()['viewAllUrl'] as string) || '#all-courses';
  }

  handleImageError(event: Event, name: string): void {
    const img = event.target as HTMLImageElement;
    if (img && img.parentElement) {
      img.parentElement.innerHTML = `<span class="text-xs text-gray-600 dark:text-gray-400">${name.charAt(0)}</span>`;
    }
  }

  getCourses(): Array<{
    title: string;
    description: string;
    category: string;
    level: string;
    instructor: string;
    instructorAvatar: string;
    image: string;
    lessons: number;
    rating: string;
    price: string;
    originalPrice?: string;
    url?: string;
  }> {
    return (this.getData()['courses'] as Array<any>) || [
      {
        title: 'Complete Web Development Bootcamp',
        description: 'Master HTML, CSS, JavaScript, React, Node.js and more. Build real-world projects.',
        category: 'Web Development',
        level: 'Beginner',
        instructor: 'Sarah Johnson',
        instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
        lessons: 120,
        rating: '4.8',
        price: '$99',
        originalPrice: '$199',
        url: '#course-1'
      },
      {
        title: 'Data Science & Machine Learning',
        description: 'Learn Python, pandas, scikit-learn, and TensorFlow. Analyze data and build ML models.',
        category: 'Data Science',
        level: 'Intermediate',
        instructor: 'Michael Chen',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        lessons: 95,
        rating: '4.9',
        price: '$129',
        originalPrice: '$249',
        url: '#course-2'
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn design principles, Figma, prototyping, and user research. Create stunning interfaces.',
        category: 'Design',
        level: 'Beginner',
        instructor: 'Emily Rodriguez',
        instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
        lessons: 80,
        rating: '4.7',
        price: '$89',
        originalPrice: '$179',
        url: '#course-3'
      }
    ];
  }
}
