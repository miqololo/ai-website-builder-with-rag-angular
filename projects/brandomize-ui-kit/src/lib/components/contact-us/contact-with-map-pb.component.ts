import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PFormComponent } from '@brandomize/primitives/p-form/p-form.component';
import { PInputComponent } from '@brandomize/primitives/p-input/p-input.component';
import { PTextareaComponent } from '@brandomize/primitives/p-textarea/p-textarea.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

/**
 * Contact section with form and embedded map.
 * Map uses iframe embed (Google Maps embed URL or similar).
 */
@Component({
  selector: 'bkit-contact-with-map-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PFormComponent,
    PInputComponent,
    PTextareaComponent,
    PButtonComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <bkit-stack [config]="getHeaderStackConfig()">
            <bkit-text
              [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"
            ></bkit-text>
            <bkit-text
              [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"
            ></bkit-text>
          </bkit-stack>
          @if (getAddress() || getPhone() || getEmail()) {
            <div [class]="getContactInfoClasses()" class="mt-8">
              @if (getAddress()) {
                <div class="flex gap-3">
                  <svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ getAddress() }}</span>
                </div>
              }
              @if (getPhone()) {
                <div class="mt-4 flex gap-3">
                  <svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a [href]="'tel:' + getPhone()" [class]="getLinkClasses()">{{ getPhone() }}</a>
                </div>
              }
              @if (getEmail()) {
                <div class="mt-4 flex gap-3">
                  <svg class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a [href]="'mailto:' + getEmail()" [class]="getLinkClasses()">{{ getEmail() }}</a>
                </div>
              }
            </div>
          }
          <bkit-form [config]="getFormConfig()" (submit)="onSubmit($event)">
            <bkit-input [config]="getNameInputConfig()"></bkit-input>
            <bkit-input [config]="getEmailInputConfig()"></bkit-input>
            <bkit-textarea [config]="getMessageTextareaConfig()"></bkit-textarea>
            <bkit-button [config]="getSubmitButtonConfig()"></bkit-button>
          </bkit-form>
        </div>
        <div [class]="getMapWrapperClasses()">
          <iframe
            [src]="getMapEmbedUrlSafe()"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Map"
          ></iframe>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class ContactWithMapPbComponent {
  @Input() config?: ComponentConfig;

  private sanitizer = inject(DomSanitizer);

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
    return { gap: 'md' as const, alignItems: 'start' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Get in touch';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getAddress(): string {
    return (this.getData()['address'] as string) || '';
  }

  getPhone(): string {
    return (this.getData()['phone'] as string) || '';
  }

  getEmail(): string {
    return (this.getData()['email'] as string) || '';
  }

  getContactInfoClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-${textMuted} dark:text-gray-400`;
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    return `text-${primary} hover:underline dark:text-${primary.split('-')[0]}-400`;
  }

  getFormConfig() {
    return { class: ['mt-8', 'space-y-6'] };
  }

  getNameInputConfig() {
    return {
      label: 'Name',
      placeholder: 'Your name',
      required: true,
      class: []
    };
  }

  getEmailInputConfig() {
    return {
      label: 'Email',
      type: 'email' as const,
      placeholder: 'you@example.com',
      required: true,
      class: []
    };
  }

  getMessageTextareaConfig() {
    return {
      label: 'Message',
      placeholder: 'Your message...',
      rows: 5,
      required: true,
      class: []
    };
  }

  getSubmitButtonConfig() {
    const t = this.theme.themeResolved();
    return {
      variant: 'primary' as const,
      size: 'md' as const,
      text: (this.getData()['submitLabel'] as string) || 'Send message',
      class: ['w-full sm:w-auto']
    };
  }

  getMapWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `aspect-[4/3] overflow-hidden rounded-2xl bg-${surfaceMuted} dark:bg-${surfaceMutedDark} min-h-[300px] lg:min-h-[400px]`;
  }

  getMapEmbedUrl(): string {
    const url = this.getData()['mapEmbedUrl'] as string;
    if (url) return url;
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.184133623896!2d-73.987319684286!3d40.748440979326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890';
  }

  getMapEmbedUrlSafe(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getMapEmbedUrl());
  }

  onSubmit(_event: Event): void {
    // Handle form submit - emit or call API
  }
}
