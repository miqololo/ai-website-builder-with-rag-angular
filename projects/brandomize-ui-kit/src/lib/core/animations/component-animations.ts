/**
 * Animation utility functions for component animations
 */

/**
 * Get animation class name for a given animation name
 * @param name Animation name (e.g., 'fadeIn', 'slideUp', 'scale')
 * @returns CSS class name for the animation
 */
export function getAnimationClass(name: string): string {
  const animationMap: Record<string, string> = {
    fadeIn: 'animate-fade-in',
    fadeOut: 'animate-fade-out',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideLeft: 'animate-slide-left',
    slideRight: 'animate-slide-right',
    scale: 'animate-scale',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    rotate30deg: 'animate-rotate-30deg'
  };

  return animationMap[name] || '';
}
