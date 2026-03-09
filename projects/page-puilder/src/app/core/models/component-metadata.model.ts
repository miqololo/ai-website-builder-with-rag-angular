// Component metadata for page builder
export interface ComponentMetadata {
  id: string;
  type: string; // Component type identifier
  props: Record<string, any>; // Component inputs/properties
  children?: ComponentMetadata[]; // Nested components
  content?: string; // Text content for components like headings, text
}

export interface PageComponent {
  id: string;
  component: ComponentMetadata;
  position?: {
    x?: number;
    y?: number;
  };
}

export interface PageStructure {
  id: string;
  name: string;
  components: PageComponent[];
  css?: string;
  createdAt: Date;
}
