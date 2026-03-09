import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload, X } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { BuilderService } from '../../../core/services/builder.service';
import { WebsiteSettings } from '../../../core/models/builder.models';

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings-panel.component.html',
  styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent implements OnInit, OnDestroy {
  Upload = Upload;
  X = X;

  settings: WebsiteSettings = {
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    language: 'en',
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    },
    contact: {},
    social: {},
    analytics: {}
  };

  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'cs', name: 'Czech' },
    { code: 'ro', name: 'Romanian' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'th', name: 'Thai' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ms', name: 'Malay' },
    { code: 'hy', name: 'Armenian' }
  ];

  private subscription = new Subscription();

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.builderService.getWebsiteSettings().subscribe(settings => {
        this.settings = {
          ...settings,
          analytics: settings.analytics || {}
        };
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      this.settings.logo = url;
      this.updateSettings();
    };
    reader.readAsDataURL(file);
  }

  onFaviconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      this.settings.favicon = url;
      this.updateSettings();
    };
    reader.readAsDataURL(file);
  }

  onOgImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      this.settings.seo.ogImage = url;
      this.updateSettings();
    };
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.settings.logo = undefined;
    this.updateSettings();
  }

  removeFavicon(): void {
    this.settings.favicon = undefined;
    this.updateSettings();
  }

  removeOgImage(): void {
    this.settings.seo.ogImage = undefined;
    this.updateSettings();
  }

  updateSettings(): void {
    this.builderService.updateWebsiteSettings(this.settings);
  }

  onFieldChange(): void {
    this.updateSettings();
  }

  get analytics() {
    if (!this.settings.analytics) {
      this.settings.analytics = {};
    }
    return this.settings.analytics;
  }
}
