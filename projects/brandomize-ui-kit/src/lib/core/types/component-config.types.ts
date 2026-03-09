/**
 * ComponentConfig – unified types for compositions, primitives, and theme.
 * Supports JSON-driven DOM structure with events, transitions, and nesting.
 *
 * @example ElementConfig (primitive DOM node)
 * {
 *   "tag": "div",
 *   "id": "root",
 *   "class": ["card", "shadow"],
 *   "attr": { "data-role": "panel", "title": "Hello" },
 *   "event": {
 *     "click": { "handler": "onCardClick", "args": { "source": "root" }, "prevent": true }
 *   },
 *   "transition": {
 *     "enter": { "name": "fadeIn", "duration": 250, "easing": "ease-out" },
 *     "leave": { "name": "fadeOut", "duration": 200, "easing": "ease-in" }
 *   },
 *   "children": [
 *     "Text node ",
 *     { "tag": "span", "class": "badge", "children": ["New"] }
 *   ]
 * }
 *
 * @example ComponentConfig (composition/primitive)
 * {
 *   "type": "hero-simple-centered-pb",
 *   "id": "hero",
 *   "classes": ["custom-hero"],
 *   "data": { "title": "Welcome", "subtitle": "..." },
 *   "theme": { "colors": { "primary": "violet-600" } },
 *   "children": [{ "type": "stack", "data": {}, "children": [] }]
 * }
 */

import type { GlobalThemeConfig } from '@brandomize/core/theme/theme.config';

// ─── Event Handler Config ───────────────────────────────────────────────────

export interface EventHandlerConfig {
  /** Handler name (looked up via event registry) */
  handler: string;
  /** Arguments passed to handler */
  args?: Record<string, unknown>;
  /** Prevent default behavior */
  prevent?: boolean;
  /** Stop propagation */
  stop?: boolean;
}

// ─── Transition / Animation Config ───────────────────────────────────────────

export interface TransitionStep {
  /** Animation name (e.g. fadeIn, slideUp, fadeOut) */
  name: string;
  /** Duration in ms */
  duration?: number;
  /** CSS easing (e.g. ease-out, ease-in) */
  easing?: string;
}

export interface TransitionConfig {
  enter?: TransitionStep;
  leave?: TransitionStep;
}

// ─── Element Config (low-level DOM node, primitives) ─────────────────────────

export interface ElementConfig {
  /** HTML tag (div, span, section, a, button, etc.) */
  tag?: string;
  /** Element id */
  id?: string;
  /** CSS classes – array or space-separated string */
  class?: string[] | string;
  /** HTML attributes (data-*, title, href, src, etc.) */
  attr?: Record<string, string | number | boolean | undefined>;
  /** Event handlers keyed by event name */
  event?: Record<string, EventHandlerConfig>;
  /** Enter/leave transitions */
  transition?: TransitionConfig;
  /** Child nodes: strings (text) or nested element configs */
  children?: (string | ElementConfig)[];
}

// ─── Component Config (compositions & primitives) ─────────────────────────────

export interface ComponentConfig {
  /** Component type – maps to renderer (e.g. hero-simple-centered-pb, stack, button) */
  type: string;
  /** Unique id */
  id?: string;
  /** Tailwind CSS classes */
  classes?: string[];
  /** Component-specific data/config */
  data?: Record<string, unknown>;
  /** Icon config (name, size, etc.) for icon-bearing primitives */
  icon?: { name?: string; size?: number; [key: string]: unknown };
  /** Enter/leave transitions */
  transition?: TransitionConfig;
  /** Page-level theme override */
  theme?: Partial<GlobalThemeConfig>;
  /** Child component configs */
  children?: ComponentConfig[];
}

// ─── Page / Stack Config (root structure) ───────────────────────────────────

export interface PageConfig extends ComponentConfig {
  type: 'stack';
  /** Theme for entire page */
  theme?: Partial<GlobalThemeConfig>;
  /** Page-level data */
  data?: Record<string, unknown>;
  /** Nested sections/components */
  children?: ComponentConfig[];
}

// ─── Theme (re-export for convenience) ───────────────────────────────────────

export type { GlobalThemeConfig };

// ─── Type guards ─────────────────────────────────────────────────────────────

export function isElementConfig(
  node: string | ElementConfig
): node is ElementConfig {
  return typeof node === 'object' && node !== null && 'tag' in node;
}

export function isComponentConfig(
  node: unknown
): node is ComponentConfig {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    typeof (node as ComponentConfig).type === 'string'
  );
}
