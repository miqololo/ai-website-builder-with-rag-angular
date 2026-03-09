# Page Builder Components System Documentation

This document provides comprehensive information about the Page Builder Components system, including primitives, components, animations, theming, and component structure. Use this as a reference when building or modifying components.

---

## Table of Contents

1. [Primitives](#primitives)
2. [Component Categories](#component-categories)
3. [Animations](#animations)
4. [Theming System](#theming-system)
5. [Tailwind CSS](#tailwind-css)
6. [Lucide Angular](#lucide-angular)
7. [Component Structure](#component-structure)
8. [Dynamic & Customizable Properties](#dynamic--customizable-properties)

---

## Primitives

Primitives are the foundational building blocks of the system. They are reusable UI elements that can be composed together to create complex components.

### Layout Primitives

#### `section` (p-section)
**Description**: Full-width section container with background, padding, spacing options, and scroll-triggered animation support.

**Config Properties**:
- `background`: `'default' | 'muted' | 'white' | 'dark' | 'gradient' | 'gradientMuted' | 'pattern'` - Background variant
- `backgroundImage`: `string` - Background image URL
- `backgroundVideo`: `string` - Background video URL
- `backgroundOverlay`: `boolean` - Show overlay on background media
- `backgroundOverlayOpacity`: `number` - Overlay opacity (0-1)
- `padding`: `'none' | 'sm' | 'md' | 'lg'` - Padding size
- `maxWidth`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'` - Container max width
- `animateOnScroll`: `boolean` - Enable scroll-triggered animations for child elements
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Background colors (theme-aware)
- Padding sizes
- Custom classes
- Scroll-triggered animations

**Scroll-Triggered Animations**:
When `animateOnScroll` is set to `true`, the section will automatically trigger animations on child elements when the section scrolls into view. This feature:

- Uses `IntersectionObserver` to detect when the section enters the viewport
- Triggers when 10% of the section is visible
- Automatically animates elements with `opacity-0` classes (adds fade-in animation)
- Ensures existing animation classes (like `animate-fade-in`) play correctly
- Disconnects after first trigger to prevent re-triggering on scroll

**Usage Example**:
```typescript
// Via config object
{
  type: 'section',
  data: {
    animateOnScroll: true,
    padding: 'lg',
    background: 'muted'
  },
  children: [
    {
      type: 'text',
      data: {
        content: 'This will fade in when scrolled into view',
        classes: ['opacity-0', 'animate-fade-in']
      }
    }
  ]
}

// Via direct input binding
<bkit-section [animateOnScroll]="true" [config]="sectionConfig">
  <!-- Content with animations -->
</bkit-section>
```

**How It Works**:
1. When `animateOnScroll` is enabled, an `IntersectionObserver` is set up after the component initializes
2. The observer watches for when the section becomes 10% visible in the viewport
3. When triggered, it:
   - Finds all elements with `opacity-0` classes that don't have animation classes
   - Adds a `fadeIn` animation to those elements
   - Ensures existing animation classes are set to play
4. The observer disconnects after the first trigger to prevent re-animation on subsequent scrolls

**Best Practices**:
- Use with components that have `opacity-0` classes from theme animation presets
- Works seamlessly with `component-renderer` animations (fadeIn, slideUp, scale)
- Set `animateOnScroll: true` on sections that contain animated content
- Animations use `animation-fill-mode: forwards` to persist final state

---

#### `container` (p-container)
**Description**: Centered container with max-width constraints.

**Config Properties**:
- `maxWidth`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'` - Max width
- `padding`: `'none' | 'sm' | 'md' | 'lg'` - Padding size
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Max width constraints
- Padding sizes
- Custom classes

---

#### `stack` (p-stack)
**Description**: Vertical stack layout with configurable gap.

**Config Properties**:
- `gap`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` - Gap between items
- `align`: `'start' | 'center' | 'end' | 'stretch'` - Alignment
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Gap sizes
- Alignment options
- Custom classes

---

#### `row` (p-row)
**Description**: Horizontal row layout with configurable gap and alignment.

**Config Properties**:
- `gap`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` - Gap between items
- `align`: `'start' | 'center' | 'end' | 'stretch'` - Vertical alignment
- `justify`: `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'` - Horizontal justification
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Gap sizes
- Alignment and justification
- Custom classes

---

#### `grid` (p-grid)
**Description**: CSS Grid layout with configurable columns and gap.

**Config Properties**:
- `cols`: `number` - Number of columns (1-12)
- `gap`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` - Gap between items
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Column count
- Gap sizes
- Responsive breakpoints (sm, md, lg, xl)
- Custom classes

---

#### `box` (p-box)
**Description**: Generic container box with padding and styling options.

**Config Properties**:
- `padding`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` - Padding size
- `background`: `'default' | 'muted' | 'white' | 'dark'` - Background variant
- `border`: `boolean` - Show border
- `radius`: `'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Border radius
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Padding, background, border, radius
- Custom classes

---

### Content Primitives

#### `text` (p-text)
**Description**: Typography component with configurable tag, size, weight, color, and alignment.

**Config Properties**:
- `tag`: `'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div'` - HTML tag
- `content`: `string` - Text content
- `size`: `'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'` - Font size
- `weight`: `'normal' | 'medium' | 'semibold' | 'bold'` - Font weight
- `color`: `string` - Text color (theme color name or Tailwind class)
- `align`: `'left' | 'center' | 'right' | 'justify'` - Text alignment
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- All typography properties
- Theme color resolution
- Custom classes

---

#### `image` (p-image)
**Description**: Image component with src, alt, and sizing options.

**Config Properties**:
- `src`: `string` - Image URL
- `alt`: `string` - Alt text
- `width`: `number | string` - Image width
- `height`: `number | string` - Image height
- `objectFit`: `'contain' | 'cover' | 'fill' | 'none' | 'scale-down'` - Object fit
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Image source
- Dimensions
- Object fit
- Custom classes

---

#### `icon` (p-icon)
**Description**: Lucide icon component with configurable name, size, and color.

**Config Properties**:
- `name`: `string` - Icon name (Lucide icon name)
- `size`: `number` - Icon size in pixels
- `color`: `string` - Icon color (theme color name or Tailwind class)
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Icon name
- Size and color
- Custom classes

---

#### `video` (p-video)
**Description**: Video component with src, controls, autoplay, and loop options.

**Config Properties**:
- `src`: `string` - Video URL
- `controls`: `boolean` - Show controls
- `autoplay`: `boolean` - Autoplay video
- `loop`: `boolean` - Loop video
- `muted`: `boolean` - Mute video
- `poster`: `string` - Poster image URL
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Video source
- Playback options
- Custom classes

---

#### `embed` (p-embed)
**Description**: Embed component for iframes (YouTube, Vimeo, maps, etc.).

**Config Properties**:
- `src`: `string` - Embed URL
- `width`: `number | string` - Width
- `height`: `number | string` - Height
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Embed source
- Dimensions
- Custom classes

---

### Interactive Primitives

#### `button` (p-button)
**Description**: Button component with variants, sizes, and link support.

**Config Properties**:
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'` - Button variant
- `size`: `'sm' | 'md' | 'lg'` - Button size
- `text`: `string` - Button text
- `href`: `string` - Optional link URL (renders as `<a>` if provided)
- `ariaLabel`: `string` - Accessibility label
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Variant and size
- Text and href
- Theme color resolution
- Custom classes

---

#### `link` (p-link)
**Description**: Link component with href, target, and styling options.

**Config Properties**:
- `text`: `string` - Link text
- `href`: `string` - Link URL
- `target`: `'_blank' | '_self' | '_parent' | '_top'` - Link target
- `rel`: `string` - Rel attribute
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Link text and URL
- Target and rel
- Custom classes

---

#### `card` (p-card)
**Description**: Card container with variant, padding, and children support.

**Config Properties**:
- `variant`: `'default' | 'muted' | 'outline' | 'elevated'` - Card variant
- `padding`: `'none' | 'sm' | 'md' | 'lg' | 'xl'` - Padding size
- `class`: `string[]` - Additional CSS classes
- `children`: `ComponentConfig[]` - Child components

**Dynamic Properties**:
- Variant and padding
- Theme color resolution
- Custom classes
- Nested children

---

### Form Primitives

#### `form` (p-form)
**Description**: Form container with action, method, and children support.

**Config Properties**:
- `action`: `string` - Form action URL
- `method`: `'get' | 'post'` - Form method
- `class`: `string[]` - Additional CSS classes
- `children`: `ComponentConfig[]` - Form field children

**Dynamic Properties**:
- Action and method
- Custom classes
- Nested form fields

---

#### `input` (p-input)
**Description**: Text input field with label, placeholder, type, and validation.

**Config Properties**:
- `label`: `string` - Input label
- `placeholder`: `string` - Placeholder text
- `type`: `'text' | 'email' | 'password' | 'tel' | 'url' | 'number'` - Input type
- `required`: `boolean` - Required field
- `value`: `string` - Default value
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label, placeholder, type
- Required and value
- Custom classes

---

#### `textarea` (p-textarea)
**Description**: Multi-line text input with label, placeholder, and rows.

**Config Properties**:
- `label`: `string` - Textarea label
- `placeholder`: `string` - Placeholder text
- `rows`: `number` - Number of rows
- `required`: `boolean` - Required field
- `value`: `string` - Default value
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label, placeholder, rows
- Required and value
- Custom classes

---

#### `dropdown` (p-dropdown)
**Description**: Select dropdown with label and options.

**Config Properties**:
- `label`: `string` - Dropdown label
- `options`: `Array<{ label: string; value: string }>` - Dropdown options
- `placeholder`: `string` - Placeholder text
- `required`: `boolean` - Required field
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label and options
- Placeholder and required
- Custom classes

---

#### `checkbox` (p-checkbox)
**Description**: Checkbox input with label and checked state.

**Config Properties**:
- `label`: `string` - Checkbox label
- `checked`: `boolean` - Checked state
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label and checked state
- Custom classes

---

#### `radio` (p-radio)
**Description**: Radio button group with name and options.

**Config Properties**:
- `name`: `string` - Radio group name
- `options`: `Array<{ label: string; value: string }>` - Radio options
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Name and options
- Custom classes

---

### UI Primitives

#### `badge` (p-badge)
**Description**: Badge/tag component with variant and label.

**Config Properties**:
- `label`: `string` - Badge text
- `variant`: `'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'` - Badge variant
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label and variant
- Theme color resolution
- Custom classes

---

#### `avatar` (p-avatar)
**Description**: User avatar with image source and size options.

**Config Properties**:
- `src`: `string` - Avatar image URL
- `alt`: `string` - Alt text
- `size`: `'sm' | 'md' | 'lg' | 'xl'` - Avatar size
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Image source and size
- Custom classes

---

#### `chip` (p-chip)
**Description**: Removable chip/tag component.

**Config Properties**:
- `label`: `string` - Chip text
- `onRemove`: `() => void` - Remove handler
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label
- Remove handler
- Custom classes

---

#### `toggle` (p-toggle)
**Description**: Toggle switch component with label and checked state.

**Config Properties**:
- `label`: `string` - Toggle label
- `checked`: `boolean` - Checked state
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label and checked state
- Custom classes

---

#### `slider` (p-slider)
**Description**: Range slider component with min, max, and value.

**Config Properties**:
- `label`: `string` - Slider label
- `min`: `number` - Minimum value
- `max`: `number` - Maximum value
- `value`: `number` - Current value
- `step`: `number` - Step increment
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Label, min, max, value, step
- Custom classes

---

#### `progress` (p-progress)
**Description**: Progress bar component with value and max.

**Config Properties**:
- `value`: `number` - Current progress value
- `max`: `number` - Maximum value (default: 100)
- `label`: `string` - Optional label
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Value and max
- Label
- Custom classes

---

#### `alert` (p-alert)
**Description**: Alert component with variant and message.

**Config Properties**:
- `variant`: `'success' | 'warning' | 'error' | 'info'` - Alert variant
- `message`: `string` - Alert message
- `dismissible`: `boolean` - Show dismiss button
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Variant and message
- Dismissible option
- Theme color resolution
- Custom classes

---

#### `spacer` (p-spacer)
**Description**: Spacing component with configurable height.

**Config Properties**:
- `height`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'` - Spacing height
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Height size
- Custom classes

---

#### `divider` (p-divider)
**Description**: Horizontal divider line component.

**Config Properties**:
- `variant`: `'solid' | 'dashed' | 'dotted'` - Divider variant
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Variant
- Custom classes

---

### Advanced Primitives

#### `accordion` (p-accordion)
**Description**: Accordion component with collapsible items.

**Config Properties**:
- `items`: `Array<{ title: string; content: string; open?: boolean }>` - Accordion items
- `class`: `string[]` - Additional CSS classes
- `children`: `ComponentConfig[]` - Child components (alternative to items)

**Dynamic Properties**:
- Items array
- Open/closed states
- Custom classes
- Nested children

---

#### `tabs` (p-tabs)
**Description**: Tabs component with tab items and content.

**Config Properties**:
- `items`: `Array<{ label: string; content: string }>` - Tab items
- `defaultTab`: `number` - Default active tab index
- `class`: `string[]` - Additional CSS classes
- `children`: `ComponentConfig[]` - Child components (alternative to items)

**Dynamic Properties**:
- Tab items
- Active tab
- Custom classes
- Nested children

---

#### `modal` (p-modal)
**Description**: Modal dialog component with open/close state.

**Config Properties**:
- `open`: `boolean` - Modal open state
- `title`: `string` - Modal title
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'` - Modal size
- `class`: `string[]` - Additional CSS classes
- `children`: `ComponentConfig[]` - Modal content

**Dynamic Properties**:
- Open state
- Title and size
- Custom classes
- Nested children

---

#### `breadcrumb` (p-breadcrumb)
**Description**: Breadcrumb navigation component.

**Config Properties**:
- `items`: `Array<{ label: string; href?: string }>` - Breadcrumb items
- `class`: `string[]` - Additional CSS classes

**Dynamic Properties**:
- Items array
- Custom classes

---

## Component Categories

Components are organized into categories based on their purpose and use case.

### Hero Banners
- `hero-simple-centered-pb` - Centered hero with title, subtitle, and buttons
- `hero-split-with-image-pb` - Split layout hero with image
- `hero-split-with-screenshot-pb` - Hero with screenshot on the side
- `hero-with-angled-image-right-pb` - Hero with angled image
- `hero-with-image-tiles-pb` - Hero with image tiles

---

### Headers
- `header-minimal-pb` - Minimal header with navigation
- `header-with-cta-pb` - Header with call-to-action button
- `header-megamenu-pb` - Header with mega menu dropdowns
- `header-multilevel-pb` - Multi-level navigation header
- `header-transparent-pb` - Transparent header overlay
- `header-menu-with-icons-pb` - Header with icon menu items

---

### Features
- `features-minimal-centered-pb` - Minimal centered features
- `features-grid-with-icons-pb` - Features grid with icons
- `features-list-with-descriptions-pb` - Features list with descriptions
- `features-cards-with-hover-pb` - Feature cards with hover effects
- `features-split-image-pb` - Features with split image layout
- `features-split-with-images-pb` - Features with multiple images

---

### Pricing
- `pricing-minimal-pb` - Minimal pricing section
- `pricing-simple-cards-pb` - Pricing as simple cards
- `pricing-comparison-table-pb` - Pricing comparison table
- `pricing-featured-plan-pb` - Pricing with featured plan highlight
- `pricing-with-toggle-pb` - Pricing with monthly/yearly toggle

---

### Testimonials
- `testimonials-minimal-pb` - Minimal testimonials
- `testimonials-simple-cards-pb` - Testimonials as simple cards
- `testimonials-featured-pb` - Featured testimonials layout
- `testimonials-with-gradient-pb` - Testimonials with gradient background
- `testimonials-with-quote-icon-pb` - Testimonials with quote icons
- `testimonials-with-overlapping-image-pb` - Testimonials with overlapping images
- `testimonials-with-bento-grid-pb` - Testimonials in bento grid
- `testimonials-videos-images-animated-pb` - Animated testimonials with videos/images

---

### Stats
- `stats-minimal-pb` - Minimal stats display
- `stats-simple-grid-pb` - Stats in simple grid
- `stats-with-icons-pb` - Stats with icons
- `stats-bento-pb` - Stats in bento grid layout
- `stats-with-gradient-pb` - Stats with gradient background

---

### FAQ
- `faq-minimal-pb` - Minimal FAQ section
- `faq-accordion-pb` - FAQ with accordion layout
- `faq-split-pb` - FAQ with split layout
- `faq-split-qa-pb` - FAQ with Q&A split layout
- `faq-with-gradient-pb` - FAQ with gradient background
- `faq-with-icons-pb` - FAQ with icons

---

### CTA (Call-to-Action)
- `cta-minimal-pb` - Minimal CTA section
- `cta-centered-pb` - Centered CTA
- `cta-gradient-pb` - CTA with gradient background
- `cta-split-pb` - CTA with split layout
- `cta-with-image-pb` - CTA with image
- `cta-with-stats-pb` - CTA with statistics

---

### Blog
- `blog-simple-cards-pb` - Blog posts as simple cards
- `blog-minimal-list-pb` - Blog posts in minimal list
- `blog-featured-grid-pb` - Blog posts in featured grid
- `blog-masonry-pb` - Blog posts in masonry layout
- `blog-with-categories-pb` - Blog with category filters
- `blog-with-gradient-pb` - Blog with gradient background

---

### Team
- `team-grid-cards-pb` - Team members in grid cards
- `team-minimal-list-pb` - Team members in minimal list
- `team-alternating-pb` - Team members in alternating layout
- `team-overlapping-avatars-pb` - Team with overlapping avatars
- `team-social-links-pb` - Team with social links
- `team-with-gradient-pb` - Team with gradient background

---

### Logo Cloud
- `logo-cloud-minimal-pb` - Minimal logo cloud
- `logo-cloud-centered-pb` - Centered logo cloud
- `logo-cloud-bordered-pb` - Logo cloud with borders
- `logo-cloud-compact-pb` - Compact logo cloud
- `logo-cloud-grayscale-pb` - Grayscale logo cloud
- `logo-cloud-with-gradient-pb` - Logo cloud with gradient

---

### How It Works
- `how-it-works-numbered-circles-pb` - Numbered circles layout
- `how-it-works-bento-steps-pb` - Bento grid steps layout
- `how-it-works-horizontal-cards-pb` - Horizontal cards layout
- `how-it-works-vertical-timeline-pb` - Vertical timeline layout
- `how-it-works-with-icons-pb` - Steps with icons

---

### Bento Grids
- `bento-minimal-pb` - Minimal bento grid
- `bento-classic-pb` - Classic bento grid
- `bento-asymmetric-pb` - Asymmetric bento grid
- `bento-with-images-pb` - Bento grid with images
- `bento-colorful-pb` - Colorful bento grid

---

### Newsletter
- `newsletter-centered-pb` - Centered newsletter signup
- `newsletter-compact-pb` - Compact newsletter signup
- `newsletter-minimal-pb` - Minimal newsletter signup
- `newsletter-split-pb` - Newsletter with split layout

---

### Footers
- `footer-minimal-pb` - Minimal footer
- `footer-centered-pb` - Centered footer
- `footer-multi-column-pb` - Multi-column footer
- `footer-with-gradient-pb` - Footer with gradient background
- `footer-with-newsletter-pb` - Footer with newsletter signup
- `footer-with-social-links-pb` - Footer with social links

---

### Not Found (404)
- `not-found-minimal-pb` - Minimal 404 page
- `not-found-centered-pb` - Centered 404 page
- `not-found-humorous-pb` - Humorous 404 page
- `not-found-with-gradient-pb` - 404 with gradient background
- `not-found-with-illustration-pb` - 404 with illustration
- `not-found-with-search-pb` - 404 with search functionality

---

### Widgets
- `carousel-full-width-pb` - Full-width carousel that accepts any component as slides
- `carousel-infinite-scroll-pb` - Infinitely scrolling carousel for logos, reviews, products
- `animated-grid-pb` - Animated grid with scrolling columns (up/down)
- `testimonials-videos-images-animated-pb` - Animated testimonials with videos/images
- `contact-with-map-pb` - Contact form with embedded map

---

### Contact Us
- `contact-with-map-pb` - Contact form with embedded map

---

## Animations

The system supports several animation types for component transitions and effects.

### Supported Animations

#### Fade Animations
- `fadeIn` - Fade in animation
- `fadeOut` - Fade out animation

---

#### Slide Animations
- `slideUp` - Slide up animation
- `slideDown` - Slide down animation
- `slideLeft` - Slide left animation
- `slideRight` - Slide right animation

---

#### Scale Animations
- `scale` - Scale animation (zoom in/out)

---

#### Rotate Animations
- `rotateIn` - Rotate in animation (from -180deg to 0deg)
- `rotate30deg` - Rotate to 30 degrees animation (from 0deg to 30deg)

---

#### Motion Animations
- `bounce` - Bounce animation
- `pulse` - Pulse animation
- `spin` - Spin animation

---

### Custom Animations

Components can define custom animations using CSS keyframes:

#### Infinite Scroll Animations
- `animate-scroll-left` - Infinite scroll left
- `animate-scroll-right` - Infinite scroll right
- `animate-scroll-up` - Infinite scroll up
- `animate-scroll-down` - Infinite scroll down

---

### Animation Configuration

Animations are configured via the `transition` property in `ComponentConfig`:

```typescript
{
  transition: {
    enter: {
      name: 'fadeIn',
      duration: 300,
      easing: 'ease-out'
    },
    leave: {
      name: 'fadeOut',
      duration: 200,
      easing: 'ease-in'
    }
  }
}
```

**Dynamic Properties**:
- Animation name
- Duration (milliseconds)
- Easing function
- Enter/leave transitions

---

### Scroll-Triggered Animations

Sections can trigger animations when scrolled into view using the `animateOnScroll` property:

**Section-Level Scroll Animation**:
```typescript
{
  type: 'section',
  data: {
    animateOnScroll: true,  // Enable scroll-triggered animations
    padding: 'lg'
  },
  children: [
    {
      type: 'text',
      data: {
        content: 'This fades in when section is scrolled into view',
        classes: ['opacity-0', 'animate-fade-in']
      }
    }
  ]
}
```

**How Scroll-Triggered Animations Work**:
1. **Intersection Observer**: Uses browser's `IntersectionObserver` API to detect when section enters viewport
2. **Trigger Threshold**: Animations trigger when 10% of the section is visible
3. **Automatic Animation**: Elements with `opacity-0` classes automatically get fade-in animations
4. **Existing Animations**: Ensures existing animation classes (like `animate-fade-in`) play correctly
5. **One-Time Trigger**: Observer disconnects after first trigger to prevent re-animation

**Animation Fill Mode**:
All animations use `animation-fill-mode: forwards` to persist the final state after animation completes. This ensures elements remain visible after animating in.

**Best Practices**:
- Enable `animateOnScroll` on sections containing animated content
- Use theme animation presets (`fadeIn`, `slideUp`, `scale`) for consistent animations
- Combine with `opacity-0` classes for fade-in effects
- Works seamlessly with component-renderer's automatic animation classes

---

## Theming System

The theming system provides comprehensive customization of colors, typography, spacing, shadows, and component-specific styles.

### Theme Structure

#### Colors (`ThemeColors`)
- `primary` - Primary brand color
- `primaryHover` - Primary hover color
- `primaryMuted` - Primary muted color (e.g., indigo-50)
- `secondary` - Secondary brand color
- `background` - Page background color
- `backgroundMuted` - Muted background color
- `surface` - Surface color (cards, containers)
- `surfaceHover` - Surface hover color
- `surfaceMuted` - Muted surface color (e.g., gray-100)
- `surfaceMutedDark` - Dark mode muted surface (e.g., gray-800)
- `surfaceDark` - Dark mode surface (e.g., gray-900)
- `text` - Primary text color
- `textMuted` - Muted text color
- `textMutedLight` - Light muted text (e.g., gray-500)
- `border` - Border color
- `borderMuted` - Muted border color (e.g., gray-300)
- `borderMutedDark` - Dark mode muted border (e.g., gray-600/700)
- `borderHover` - Border hover color
- `accent` - Accent color
- `success` - Success color
- `successMuted` - Success muted color (e.g., green-100)
- `warning` - Warning color
- `warningMuted` - Warning muted color (e.g., yellow-100)
- `error` - Error color
- `errorMuted` - Error muted color (e.g., red-100)
- `info` - Info color
- `infoMuted` - Info muted color (e.g., blue-100)

**Dynamic Properties**:
- All color values can be Tailwind color classes (e.g., `indigo-600`, `gray-900`)
- Colors are resolved at runtime via `ThemeService`
- Supports dark mode variants

---

#### Typography (`ThemeTypography`)
- `fontFamily` - Base font family
- `fontFamilyHeading` - Heading font family
- `fontLink` - Google Fonts or custom font URL
- `fontSize` - Font size scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl)
- `fontWeight` - Font weight scale (normal, medium, semibold, bold)
- `lineHeight` - Line height scale (tight, normal, relaxed)

**Dynamic Properties**:
- Font families and sizes
- Font weights and line heights
- Custom font imports

---

#### Radius (`ThemeRadius`)
- `none`, `sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl`, `full`

**Dynamic Properties**:
- Border radius values
- Component-specific radius

---

#### Shadow (`ThemeShadow`)
- `sm`, `DEFAULT`, `md`, `lg`, `xl`, `2xl`

**Dynamic Properties**:
- Shadow values
- Component-specific shadows

---

#### Component-Specific Themes

Each primitive can have theme-specific styling:

- `button` - Button variants, sizes, colors
- `card` - Card backgrounds, borders, shadows
- `input` - Input styles, focus states
- `text` - Typography styles
- And more...

**Dynamic Properties**:
- Component-specific color overrides
- Size and spacing overrides
- Variant-specific styles

---

### Theme Application

Themes can be applied at multiple levels:

1. **Global Theme** - Applied to entire application
2. **Page Theme** - Applied to a specific page (`PageConfig.theme`)
3. **Component Theme** - Applied to a specific component (`ComponentConfig.theme`)

**Priority**: Component > Page > Global

---

### ThemeService API

The `ThemeService` provides methods for working with themes:

#### Setting Themes
```typescript
// Set global theme
themeService.setTheme({
  colors: {
    primary: 'indigo-600',
    secondary: 'purple-600'
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontLink: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  }
});

// Reset to default theme
themeService.resetTheme();
```

#### Accessing Theme Values
```typescript
// Get resolved theme (defaults + overrides merged)
const theme = themeService.themeResolved();

// Get specific color class
const primaryBg = themeService.getColorClass('bg', 'primary'); // Returns: 'bg-indigo-600'

// Get gradient classes
const heroGradient = themeService.getGradientClass('hero'); // Returns: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'

// Get transition classes
const transition = themeService.getTransitionClass('normal', 'all'); // Returns: 'transition-all duration-300 ease-out'
```

#### Theme Resolution

The theme system uses a deep merge strategy:
- Default theme values are merged with custom overrides
- Component-level themes override page-level themes
- Page-level themes override global themes
- Colors are resolved at runtime via `ThemeService`
- Dynamic CSS is injected into the document head for theme classes

---

### Runtime CSS Generation

The system generates CSS at runtime for dynamic theme classes:

1. **Color Token Extraction**: Extracts color tokens from theme config (e.g., `indigo-600`, `gray-900`)
2. **CSS Rule Generation**: Generates CSS rules for:
   - Text colors: `.text-{color}`
   - Background colors: `.bg-{color}`
   - Border colors: `.border-{color}`
   - Ring colors: `.ring-{color}`
   - Important modifiers: `.!text-{color}`, `.!bg-{color}`, etc.
   - Gradient utilities: `.from-{color}`, `.via-{color}`, `.to-{color}`
   - Dark mode variants: `.dark:bg-{color}`, `.dark:text-{color}`, etc.
3. **CSS Injection**: Injects generated CSS into `<style id="theme-runtime">` in document head

This ensures that dynamically generated Tailwind classes work even after Tailwind's purge process.

---

### Theme Configuration Structure

```typescript
interface GlobalThemeConfig {
  colors?: ThemeColors;
  typography?: ThemeTypography;
  radius?: ThemeRadius;
  shadow?: ThemeShadow;
  spacing?: ThemeSpacing;
  gradients?: ThemeGradient;
  animation?: ThemeAnimation;
  effects?: ThemeEffects;
  header?: ThemeHeader;
  page?: ThemePage;
  primitives?: ThemePrimitives;
}
```

---

### Theme Color Resolution

Colors can be specified in multiple formats:

1. **Tailwind Color Classes**: `'indigo-600'`, `'gray-900'`, `'red-500'`
2. **Theme Color Keys**: `'{primary}'`, `'{text}'`, `'{surface}'` (resolved at runtime)
3. **Opacity Variants**: `'indigo-600/50'`, `'gray-900/75'`
4. **Special Colors**: `'white'`, `'black'`, `'transparent'`

The `ThemeService` resolves theme placeholders using `resolveThemePlaceholders()`:
- Replaces `{primary}` with actual color value from theme
- Supports nested theme references
- Handles fallback values

---

### Dark Mode Support

The theme system supports dark mode through:

1. **Dark Mode Color Variants**: `surfaceDark`, `surfaceMutedDark`, `borderMutedDark`
2. **Dark Mode Classes**: Uses Tailwind's `dark:` prefix for dark mode styles
3. **Runtime CSS Generation**: Generates dark mode variants for all theme colors
4. **Component-Level Dark Mode**: Components can specify dark mode variants in their theme config

---

## Tailwind CSS

The system uses Tailwind CSS v3.4+ as its styling foundation, with custom configuration and runtime CSS generation for dynamic theming.

### Configuration

Tailwind is configured via `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/assets/**/*.json",
  ],
  safelist: [
    // Classes that might be dynamically generated
    'sticky',
    'backdrop-blur-sm',
    'shadow-lg',
    // ... more safelisted classes
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors can be added here
      }
    }
  },
  darkMode: 'class', // Enable dark mode via class
  plugins: []
}
```

---

### Content Scanning

Tailwind scans the following for class usage:
- All `.html` and `.ts` files in `src/`
- JSON theme files in `src/assets/`
- Component templates and TypeScript files

**Note**: Dynamic classes generated at runtime are handled via the theme system's CSS injection, not Tailwind's content scanning.

---

### Safelist

Classes that might be dynamically generated but not detected by Tailwind's content scanner are safelisted:

- Backdrop blur utilities (`backdrop-blur-sm`, `backdrop-blur-md`, etc.)
- Shadow utilities (`shadow-sm`, `shadow-md`, `shadow-lg`, etc.)
- Gradient utilities (`bg-gradient-to-r`, `bg-gradient-to-br`, etc.)
- Animation utilities (`animate-gradient-shift`)

---

### Using Tailwind Classes

#### In Component Templates

```typescript
// Direct Tailwind classes
<div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <span class="text-gray-900 font-semibold">Content</span>
</div>

// Responsive classes
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Content -->
</div>

// Dark mode classes
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <!-- Content -->
</div>
```

#### In Component Config Classes

```typescript
{
  type: 'section',
  classes: [
    'py-16',
    'bg-gradient-to-br',
    'from-indigo-600',
    'to-purple-600',
    'dark:from-gray-900',
    'dark:to-gray-800'
  ]
}
```

#### Dynamic Class Generation

```typescript
// Generate classes dynamically based on theme
getButtonClasses(): string {
  const t = this.theme.themeResolved();
  const primary = t.colors?.primary ?? 'indigo-600';
  return `bg-${primary} hover:bg-${primary}-700 text-white px-4 py-2 rounded-md`;
}
```

**Important**: When generating classes dynamically, ensure they're either:
1. Safelisted in `tailwind.config.js`
2. Generated via the theme system's runtime CSS injection
3. Present in template files that Tailwind can scan

---

### Tailwind Utilities Used

Common Tailwind utilities used throughout the system:

#### Layout
- `flex`, `grid`, `inline-flex`
- `flex-col`, `flex-row`
- `items-center`, `items-start`, `items-end`
- `justify-center`, `justify-between`, `justify-around`
- `gap-{size}`, `space-x-{size}`, `space-y-{size}`

#### Spacing
- `p-{size}`, `px-{size}`, `py-{size}`, `pt-{size}`, `pb-{size}`, `pl-{size}`, `pr-{size}`
- `m-{size}`, `mx-{size}`, `my-{size}`, `mt-{size}`, `mb-{size}`, `ml-{size}`, `mr-{size}`

#### Sizing
- `w-{size}`, `h-{size}`, `min-w-{size}`, `max-w-{size}`, `min-h-{size}`, `max-h-{size}`
- `w-full`, `h-full`, `w-screen`, `h-screen`

#### Typography
- `text-{size}`, `font-{weight}`, `leading-{size}`
- `text-{color}`, `text-{align}`
- `uppercase`, `lowercase`, `capitalize`

#### Colors
- `bg-{color}`, `text-{color}`, `border-{color}`, `ring-{color}`
- `bg-{color}/{opacity}`, `text-{color}/{opacity}`

#### Effects
- `shadow-{size}`, `rounded-{size}`, `opacity-{value}`
- `backdrop-blur-{size}`, `blur-{size}`

#### Transitions
- `transition-{property}`, `duration-{time}`, `ease-{type}`
- `hover:`, `focus:`, `active:`, `disabled:`

#### Responsive
- `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes for breakpoints

#### Dark Mode
- `dark:` prefix for dark mode variants

---

### PostCSS Configuration

PostCSS is configured via `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

This ensures:
- Tailwind CSS is processed
- Vendor prefixes are automatically added
- Modern CSS features are supported

---

## Lucide Angular

The system uses Lucide Angular (v0.563.0+) for icon rendering. Lucide provides a comprehensive set of icons with consistent styling.

### Icon Registration

Icons are registered globally in `lucide-icons.config.ts`:

```typescript
import { LucideAngularModule, icons } from 'lucide-angular';

// Icon aliases for backward compatibility
const ALIASES: Record<string, (typeof icons)[keyof typeof icons]> = {
  BarChart2: icons.ChartNoAxesColumn,
  BarChart: icons.ChartNoAxesColumnIncreasing,
  PieChart: icons.ChartPie,
  // ... more aliases
};

export const lucideIconsProvider = LucideAngularModule.pick({
  ...icons,
  ...ALIASES,
});
```

Icons are provided at the application level in `main.ts`:

```typescript
import { lucideIconsProvider } from './app/lucide-icons.config';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(lucideIconsProvider)
  ]
});
```

---

### Using Icons

#### In Primitive Icon Component

```typescript
// Via config
<bkit-icon [config]="{ name: 'star', size: 24, color: 'primary' }"></bkit-icon>

// Via direct props
<bkit-icon name="heart" [size]="20" color="red-500"></bkit-icon>
```

#### In Component Templates

```typescript
// Direct Lucide Angular usage
<lucide-icon
  name="chevron-right"
  [size]="20"
  color="#3b82f6"
  [strokeWidth]="2"
></lucide-icon>
```

---

### Icon Naming Convention

Icons use kebab-case naming:
- `chevron-right` (not `ChevronRight`)
- `user-circle` (not `UserCircle`)
- `bar-chart-2` (not `BarChart2`)

The system includes an alias mapping for common icon name variations:
- `bar-chart` → `chart-bar`
- `grid` → `layout-grid`
- `layout` → `layout-template`
- `help-circle` → `circle-question-mark`

---

### Icon Configuration

Icons can be configured via `PIconConfig`:

```typescript
interface PIconConfig {
  name?: string;           // Icon name (kebab-case)
  size?: number;           // Size in pixels
  color?: string;          // Color (theme color key or Tailwind class)
  strokeWidth?: number;    // Stroke width (default: 2)
  class?: string[];        // Additional CSS classes
}
```

---

### Icon Sizes

Default icon sizes (can be overridden):
- `xs`: 12px
- `sm`: 16px
- `md`: 20px (default)
- `lg`: 24px
- `xl`: 32px

Custom sizes can be specified as pixel values: `size: 18`

---

### Icon Colors

Icons support theme color resolution:

```typescript
// Theme color keys
<bkit-icon [config]="{ name: 'star', color: 'primary' }"></bkit-icon>
<bkit-icon [config]="{ name: 'heart', color: 'text' }"></bkit-icon>

// Tailwind color classes
<bkit-icon [config]="{ name: 'check', color: 'green-600' }"></bkit-icon>
<bkit-icon [config]="{ name: 'alert', color: 'red-500' }"></bkit-icon>

// Hex colors
<bkit-icon [config]="{ name: 'info', color: '#3b82f6' }"></bkit-icon>
```

---

### Available Icons

Lucide Angular provides 1000+ icons. Common icons used in the system:

- Navigation: `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down`, `arrow-right`, `arrow-left`
- Actions: `check`, `x`, `plus`, `minus`, `edit`, `trash`, `save`
- Status: `check-circle`, `alert-circle`, `info`, `warning`
- UI: `menu`, `search`, `filter`, `settings`, `user`, `bell`
- Social: `github`, `twitter`, `linkedin`, `facebook`
- Content: `image`, `video`, `file`, `folder`, `link`

For a complete list, see [Lucide Icons](https://lucide.dev/icons/).

---

### Icon Best Practices

1. **Use Semantic Names**: Choose icon names that match their purpose (`check` for success, `alert-circle` for warnings)
2. **Consistent Sizing**: Use theme size presets (`sm`, `md`, `lg`) for consistency
3. **Color from Theme**: Use theme color keys (`primary`, `text`, `muted`) for theme-aware icons
4. **Accessibility**: Always provide `aria-label` or `aria-hidden` attributes when appropriate
5. **Performance**: Icons are tree-shaken - only registered icons are included in the bundle

---

## Component Structure

### ComponentConfig Structure

```typescript
interface ComponentConfig {
  type: string;                    // Component type identifier
  id?: string;                     // Unique component ID
  classes?: string[];               // Additional CSS classes
  data?: Record<string, unknown>;   // Component-specific data
  icon?: {                         // Icon configuration
    name?: string;
    size?: number;
    [key: string]: unknown;
  };
  transition?: TransitionConfig;   // Animation configuration
  theme?: Partial<GlobalThemeConfig>; // Theme override
  children?: ComponentConfig[];     // Nested components
}
```

---

### Building Components from Primitives

Components are built hierarchically using primitives:

#### Example: Hero Component Structure

```typescript
{
  type: 'hero-simple-centered-pb',
  data: {
    title: 'Welcome',
    subtitle: 'Get started today',
    buttons: [
      { text: 'Get Started', variant: 'primary' },
      { text: 'Learn More', variant: 'secondary' }
    ]
  },
  children: [
    {
      type: 'section',
      data: { background: 'default', padding: 'lg' },
      children: [
        {
          type: 'container',
          data: { maxWidth: 'xl' },
          children: [
            {
              type: 'stack',
              data: { gap: 'lg', align: 'center' },
              children: [
                {
                  type: 'text',
                  data: {
                    tag: 'h1',
                    content: 'Welcome',
                    size: '5xl',
                    weight: 'bold',
                    align: 'center'
                  }
                },
                {
                  type: 'text',
                  data: {
                    tag: 'p',
                    content: 'Get started today',
                    size: 'xl',
                    align: 'center'
                  }
                },
                {
                  type: 'row',
                  data: { gap: 'md', justify: 'center' },
                  children: [
                    {
                      type: 'button',
                      data: { text: 'Get Started', variant: 'primary' }
                    },
                    {
                      type: 'button',
                      data: { text: 'Learn More', variant: 'secondary' }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

### Component Hierarchy Levels

1. **Page Level** (`stack`)
   - Root container
   - Page-wide theme
   - Top-level sections

2. **Section Level** (`section`)
   - Full-width sections
   - Background and padding
   - Section-specific themes

3. **Container Level** (`container`)
   - Centered content containers
   - Max-width constraints
   - Content grouping

4. **Layout Level** (`stack`, `row`, `grid`)
   - Content arrangement
   - Spacing and alignment
   - Responsive layouts

5. **Content Level** (`text`, `image`, `button`, etc.)
   - Actual content elements
   - Interactive elements
   - Media elements

---

## Dynamic & Customizable Properties

### What Can Be Dynamic

#### Colors
- All color properties support theme color resolution
- Colors can be specified as:
  - Theme color names (e.g., `primary`, `text`, `surface`)
  - Tailwind classes (e.g., `indigo-600`, `gray-900`)
  - Dynamic values resolved at runtime

#### Typography
- Font families, sizes, weights, line heights
- Text colors and alignments
- Responsive typography

#### Spacing
- Padding, margin, gap values
- Responsive spacing
- Component-specific spacing

#### Layout
- Grid columns, rows
- Flex alignment and justification
- Container max-widths
- Responsive breakpoints

#### Sizing
- Component sizes (sm, md, lg, xl)
- Image dimensions
- Icon sizes
- Avatar sizes

#### States
- Hover states
- Focus states
- Active states
- Disabled states

#### Content
- Text content
- Image sources
- Link URLs
- Form values

---

### Customization Methods

1. **Theme Configuration**
   - Global theme settings
   - Component-specific theme overrides
   - Dark mode support

2. **CSS Classes**
   - Additional classes via `classes` property
   - Custom Tailwind utilities
   - Component-specific styling

3. **Data Properties**
   - Component-specific configuration
   - Dynamic content
   - Conditional rendering

4. **Nested Composition**
   - Building complex components from primitives
   - Reusable component patterns
   - Flexible layouts

---

## Best Practices

1. **Use Primitives First**: Build components from primitives before creating custom components
2. **Leverage Theme System**: Use theme colors and typography for consistency
3. **Responsive Design**: Use responsive breakpoints (sm, md, lg, xl) for layouts
4. **Accessibility**: Include proper labels, alt text, and ARIA attributes
5. **Performance**: Optimize images and use lazy loading where appropriate
6. **Composition**: Build complex components by composing simpler primitives
7. **Reusability**: Create reusable component patterns for common layouts

---

## Component Tags Reference

### Layout Tags
- `<bkit-section>` - Section container
- `<bkit-container>` - Centered container
- `<bkit-stack>` - Vertical stack
- `<bkit-row>` - Horizontal row
- `<bkit-grid>` - CSS Grid layout
- `<bkit-box>` - Generic container box

### Content Tags
- `<bkit-text>` - Typography component
- `<bkit-image>` - Image component
- `<bkit-icon>` - Icon component
- `<bkit-video>` - Video component
- `<bkit-embed>` - Embed component

### Interactive Tags
- `<bkit-button>` - Button component
- `<bkit-link>` - Link component
- `<bkit-card>` - Card container

### Form Tags
- `<bkit-form>` - Form container
- `<bkit-input>` - Input field
- `<bkit-textarea>` - Textarea field
- `<bkit-dropdown>` - Select dropdown
- `<bkit-checkbox>` - Checkbox input
- `<bkit-radio>` - Radio button group

### UI Tags
- `<bkit-badge>` - Badge component
- `<bkit-avatar>` - Avatar component
- `<bkit-chip>` - Chip component
- `<bkit-toggle>` - Toggle switch
- `<bkit-slider>` - Range slider
- `<bkit-progress>` - Progress bar
- `<bkit-alert>` - Alert component
- `<bkit-spacer>` - Spacing component
- `<bkit-divider>` - Divider component

### Advanced Tags
- `<bkit-accordion>` - Accordion component
- `<bkit-tabs>` - Tabs component
- `<bkit-modal>` - Modal dialog
- `<bkit-breadcrumb>` - Breadcrumb navigation

---

## Conclusion

This system provides a comprehensive set of primitives and components for building modern web applications. By understanding the structure, theming, and composition patterns, you can create flexible, maintainable, and visually consistent user interfaces.

For implementation details, refer to the component source code and TypeScript interfaces in the codebase.
