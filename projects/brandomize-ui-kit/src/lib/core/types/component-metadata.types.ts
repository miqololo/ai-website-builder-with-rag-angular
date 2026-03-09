/**
 * Component metadata types for catalog and parameter definitions.
 * Used by builder and parameter-panel components.
 */

import type { ComponentConfig } from './component-config.types';

export interface ComponentParameterOption {
  label: string;
  value: string | number | boolean;
}

export interface ComponentParameter {
  key: string;
  label: string;
  description?: string;
  type: 'text' | 'textarea' | 'number' | 'color' | 'boolean' | 'select' | 'icon';
  category?: string;
  defaultValue?: unknown;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: ComponentParameterOption[];
}

export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category?: string;
  parameters: ComponentParameter[];
  defaultConfig: ComponentConfig;
}

export interface ComponentCategory {
  id: string;
  name: string;
  icon?: string;
  components: ComponentMetadata[];
}
