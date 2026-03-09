# Educational Theme - Theme 1

A modern, mobile-friendly educational theme built with Tailwind CSS. This theme includes multiple reusable components designed for educational platforms, online courses, and learning management systems.

## Components

### 1. HeroEducationalComponent (`theme1-hero-educational`)
A stunning hero section with animated background, gradient text, call-to-action buttons, and statistics display.

**Features:**
- Animated blob background effects
- Responsive design (mobile-first)
- Gradient text highlights
- Dual CTA buttons
- Statistics display
- Scroll indicator

**Usage:**
```html
<theme1-hero-educational [config]="heroConfig"></theme1-hero-educational>
```

**Configurable Properties:**
- `badge` - Badge text (default: "Start Learning Today")
- `title` - Main title
- `titleHighlight` - Highlighted portion of title
- `subtitle` - Subtitle text
- `primaryCtaText` - Primary button text
- `primaryCtaUrl` - Primary button URL
- `secondaryCtaText` - Secondary button text
- `secondaryCtaUrl` - Secondary button URL
- `stats` - Array of statistics `[{value: string, label: string}]`

---

### 2. CoursesGridComponent (`theme1-courses-grid`)
A responsive grid layout for displaying course cards with images, instructor info, ratings, and pricing.

**Features:**
- Responsive grid (1 column mobile, 2 tablet, 3 desktop)
- Course cards with hover effects
- Instructor avatars
- Rating display
- Price with discount support
- Category badges
- Level indicators

**Usage:**
```html
<theme1-courses-grid [config]="coursesConfig"></theme1-courses-grid>
```

**Configurable Properties:**
- `title` - Section title
- `subtitle` - Section subtitle
- `viewAllText` - View all button text
- `viewAllUrl` - View all button URL
- `courses` - Array of course objects with:
  - `title`, `description`, `category`, `level`
  - `instructor`, `instructorAvatar`
  - `image`, `lessons`, `rating`
  - `price`, `originalPrice`, `url`

---

### 3. FeaturesSectionComponent (`theme1-features-section`)
A features showcase section with icons, titles, and descriptions.

**Features:**
- Icon-based feature cards
- Hover animations
- Gradient icon backgrounds
- Responsive grid layout
- Dark mode support

**Usage:**
```html
<theme1-features-section [config]="featuresConfig"></theme1-features-section>
```

**Configurable Properties:**
- `title` - Section title
- `subtitle` - Section subtitle
- `features` - Array of feature objects with:
  - `title`, `description`, `icon` (video, certificate, support, mobile, community, lifetime)

---

### 4. TestimonialsComponent (`theme1-testimonials`)
A testimonials section displaying student reviews with avatars and ratings.

**Features:**
- Quote-style testimonials
- Student avatars
- Star ratings
- Responsive grid
- Clean card design

**Usage:**
```html
<theme1-testimonials [config]="testimonialsConfig"></theme1-testimonials>
```

**Configurable Properties:**
- `title` - Section title
- `subtitle` - Section subtitle
- `testimonials` - Array of testimonial objects with:
  - `name`, `role`, `quote`, `avatar`

---

### 5. CtaSectionComponent (`theme1-cta-section`)
A call-to-action section with gradient background and trust indicators.

**Features:**
- Gradient background
- Pattern overlay
- Dual CTA buttons
- Trust indicators (no credit card, free trial, cancel anytime)
- Badge display

**Usage:**
```html
<theme1-cta-section [config]="ctaConfig"></theme1-cta-section>
```

**Configurable Properties:**
- `badge` - Badge text
- `title` - CTA title
- `description` - CTA description
- `primaryCtaText` - Primary button text
- `primaryCtaUrl` - Primary button URL
- `secondaryCtaText` - Secondary button text
- `secondaryCtaUrl` - Secondary button URL

---

## Design Principles

- **Mobile-First**: All components are designed mobile-first with responsive breakpoints
- **Accessibility**: Proper semantic HTML, ARIA labels, and keyboard navigation support
- **Dark Mode**: Full dark mode support throughout all components
- **Performance**: Optimized animations and efficient CSS
- **User Experience**: Smooth transitions, hover effects, and clear visual hierarchy

## Tailwind CSS Classes Used

All components use Tailwind CSS utility classes for styling:
- Responsive utilities (`sm:`, `md:`, `lg:`)
- Dark mode utilities (`dark:`)
- Flexbox and Grid layouts
- Spacing utilities
- Color utilities
- Typography utilities
- Animation utilities

## Example Usage

```typescript
import { Component } from '@angular/core';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import {
  HeroEducationalComponent,
  CoursesGridComponent,
  FeaturesSectionComponent,
  TestimonialsComponent,
  CtaSectionComponent
} from './themes/theme-1';

@Component({
  selector: 'app-educational-page',
  standalone: true,
  imports: [
    HeroEducationalComponent,
    CoursesGridComponent,
    FeaturesSectionComponent,
    TestimonialsComponent,
    CtaSectionComponent
  ],
  template: `
    <theme1-hero-educational [config]="heroConfig"></theme1-hero-educational>
    <theme1-courses-grid [config]="coursesConfig"></theme1-courses-grid>
    <theme1-features-section [config]="featuresConfig"></theme1-features-section>
    <theme1-testimonials [config]="testimonialsConfig"></theme1-testimonials>
    <theme1-cta-section [config]="ctaConfig"></theme1-cta-section>
  `
})
export class EducationalPageComponent {
  heroConfig: ComponentConfig = {
    data: {
      title: 'Transform Your Future',
      titleHighlight: 'With Expert-Led Courses',
      subtitle: 'Join thousands of students...',
      // ... more config
    }
  };
  // ... other configs
}
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design tested on various screen sizes
