/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/**/*.{html,ts}",
    "./projects/**/assets/**/*.json",
  ],
  // Theme colors are injected at runtime via ThemeService (theme-style-generator.ts).
  // Minimal safelist for utility classes not in templates.
  safelist: [
    'sticky',
    'backdrop-blur',
    'backdrop-blur-sm',
    'backdrop-blur-md',
    'backdrop-blur-lg',
    'backdrop-blur-xl',
    'backdrop-blur-2xl',
    'backdrop-blur-3xl',
    'dark:backdrop-blur-sm',
    'dark:backdrop-blur-md',
    'dark:backdrop-blur-lg',
    'dark:backdrop-blur-xl',
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'dark:shadow-sm',
    'dark:shadow',
    'dark:shadow-md',
    'dark:shadow-lg',
    'dark:shadow-xl',
    'dark:shadow-2xl',
    'bg-gradient-to-r',
    'bg-gradient-to-l',
    'bg-gradient-to-t',
    'bg-gradient-to-b',
    'bg-gradient-to-tr',
    'bg-gradient-to-tl',
    'bg-gradient-to-br',
    'bg-gradient-to-bl',
    'bg-clip-text',
    'text-transparent',
    'bg-gradient-text',
    'animate-gradient-shift',
    'bg-[length:200%_auto]',
  ],
  theme: {
    extend: {
      // Custom theme extensions for JSON-driven theming
      colors: {
        // Add custom color palette here
      },
      spacing: {
        // Add custom spacing values here
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in forwards',
        'fade-out': 'fadeOut 300ms ease-out forwards',
        'slide-in': 'slideIn 400ms ease-out forwards',
        'slide-out': 'slideOut 400ms ease-in forwards',
        'slide-in-left': 'slideInLeft 500ms ease-out forwards',
        'slide-in-right': 'slideInRight 500ms ease-out forwards',
        'slide-left-to-right': 'slideLeftToRight 500ms ease-out forwards',
        'slide-right-to-left': 'slideRightToLeft 500ms ease-out forwards',
        'scale-in': 'scaleIn 300ms ease-out forwards',
        'rotate-in': 'rotateIn 500ms ease-out forwards',
        'rotate-30deg': 'rotate30deg 500ms ease-out forwards',
        'bounce-in': 'bounceIn 600ms ease-out forwards',
        'fade-in-up': 'fadeInUp 600ms ease-out forwards',
        'fade-in-down': 'fadeInDown 600ms ease-out forwards',
        'slide-up': 'slideUp 600ms ease-out forwards',
        'gradient-shift': 'gradientShift 4s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-20px)', opacity: '0' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideLeftToRight: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRightToLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-180deg)', opacity: '0' },
          '100%': { transform: 'rotate(0deg)', opacity: '1' },
        },
        rotate30deg: {
          '0%': { transform: 'rotate(0deg)', opacity: '0' },
          '100%': { transform: 'rotate(30deg)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '80%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        'gradient-text': '200% auto',
      },
    },
  },
  plugins: [],
}
