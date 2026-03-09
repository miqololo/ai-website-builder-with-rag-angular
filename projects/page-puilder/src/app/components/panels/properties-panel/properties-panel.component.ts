import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, Input, Output, EventEmitter, Optional, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Trash2, Copy, Box, Settings, Database } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { first } from 'rxjs';
import { BuilderService } from '../../../core/services/builder.service';
import { SelectedElement } from '../../../core/models/builder.models';
import { PageBuilderStore } from '../../../core/stores/page-builder.store';
import { MainStoreService } from '../../../core/stores/main-store.service';
import { EventManagerService } from '../../../core/services/event-manager.service';
import { PageBuilderModel } from '../../../core/models/page-builder.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LucideAngularModule,
    TranslateModule
  ],
  templateUrl: './properties-panel.component.html',
  styleUrls: ['./properties-panel.component.scss']
})
export class PropertiesPanelComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedElement: SelectedElement | null = null;
  @Output() deleteElement = new EventEmitter<void>();
  @Output() duplicateElement = new EventEmitter<void>();

  X = X;
  Trash2 = Trash2;
  Copy = Copy;
  Box = Box;
  Settings = Settings;
  Database = Database;
  parseInt = parseInt;
  parseFloat = parseFloat;
  
  // Section design/data properties (from edit-component-form)
  activeTab: 'element' | 'design' | 'data' = 'element';
  inputsArray: any[] = [];
  backgroundPositionOptions = [
    {value: "bg-top", label: "Top"},
    {value: "bg-bottom", label: "Bottom"},
    {value: "bg-left", label: "Left"},
    {value: "bg-right", label: "Right"},
    {value: "bg-center", label: "Center"},
    {value: "bg-right-top", label: "Top Right"},
    {value: "bg-left-top", label: "Top Left"},
    {value: "bg-right-bottom", label: "Right Bottom"},
    {value: "bg-left-bottom", label: "Left Bottom"},
  ];
  backgroundFit = [
    {value: "bg-cover", label: "Cover"},
    {value: "bg-contain", label: "Contain"}
  ];
  pageBuilderModel: PageBuilderModel | null = null;
  showLoader = false;
  hasError = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Handle input changes from parent component
    // Skip if change is from our own subscription to avoid loops
    if (changes['selectedElement'] && !changes['selectedElement'].firstChange) {
      const previousValue = changes['selectedElement'].previousValue;
      const currentValue = changes['selectedElement'].currentValue;
      
      // Only reload if the ID actually changed (not just reference)
      if (previousValue?.id !== currentValue?.id) {
        if (this.selectedElement?.id) {
          this.loadPropertiesForElement(this.selectedElement.id);
        } else {
          this.clearProperties();
        }
      }
    }
  }

  // Element properties
  elementTag = '';
  elementText = '';
  padding = 0; // Value in pixels for slider
  lineHeight = 1.5; // Value for slider

  private subscriptions = new Subscription();
  private isTyping = false;
  private textUpdateTimeout: any = null;
  private lastSelectedElementId: string | null = null;
  private isLoadingProperties = false;
  private isSaving = false;
  private lastSavedHtml: string = '';

  constructor(
    private builderService: BuilderService,
    @Optional() public pageStore?: PageBuilderStore,
    @Optional() public mainStore?: MainStoreService,
    @Optional() public eventManagerService?: EventManagerService
  ) {
    if (this.pageStore && this.mainStore) {
      this.pageBuilderModel = new PageBuilderModel(this.mainStore.whiteLabel);
      
      effect(() => {
        if (this.pageStore?.sectionData && this.pageStore?.componentData) {
          this.inputsArray = this.pageStore.sectionData.data?.fieldsMap || [];
          // Switch to design tab when section data is available
          if (this.pageStore.sectionData && !this.selectedElement) {
            this.activeTab = 'design';
          }
        }
      });
    }
  }

  ngOnInit(): void {
    // Listen to service for selected element changes - immediate response
    this.subscriptions.add(
      this.builderService.getSelectedElement().subscribe(element => {
        // Prevent infinite loop by checking if ID actually changed
        const newId = element?.id || null;
        if (this.lastSelectedElementId === newId) {
          // Same element, just update reference
          this.selectedElement = element;
          return;
        }
        
        this.lastSelectedElementId = newId;
        this.selectedElement = element;
        
        if (element && element.id) {
          // Immediate load - no delays
          this.loadPropertiesForElement(element.id);
        } else {
          this.clearProperties();
        }
      })
    );
  }

  loadPropertiesForElement(elementId: string): void {
    // Get element directly from iframe - simple and reliable
    const iframe = document.querySelector('iframe.preview-frame') as HTMLIFrameElement;
    if (!iframe) {
      console.warn('Iframe not found');
      return;
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      console.warn('Iframe document not accessible');
      return;
    }

    const element = iframeDoc.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID ${elementId} not found`);
      return;
    }

    // Update selected element with fresh reference
    if (this.selectedElement) {
      this.selectedElement.element = element;
    }

    this.loadElementProperties(element);
  }


  clearProperties(): void {
    this.elementTag = '';
    this.elementText = '';
    this.padding = 0;
    this.lineHeight = 1.5;
  }

  onTextBlur(): void {
    // User finished typing, reload properties and save
    this.isTyping = false;
    if (this.textUpdateTimeout) {
      clearTimeout(this.textUpdateTimeout);
      this.textUpdateTimeout = null;
    }
    // Reload properties with final text value
    if (this.selectedElement?.id) {
      const iframe = document.querySelector('iframe.preview-frame') as HTMLIFrameElement;
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const element = iframeDoc.getElementById(this.selectedElement.id);
          if (element) {
            this.loadElementProperties(element);
          }
        }
      }
    }
    this.saveChanges();
  }

  ngOnDestroy(): void {
    // Clean up timeouts
    if ((this as any).__saveTimeout) {
      clearTimeout((this as any).__saveTimeout);
    }
    if (this.textUpdateTimeout) {
      clearTimeout(this.textUpdateTimeout);
    }
    this.subscriptions.unsubscribe();
  }

  loadElementProperties(element: HTMLElement): void {
    if (!element || this.isLoadingProperties) return;
    
    this.isLoadingProperties = true;
    
    try {
      // Don't reload text if user is currently typing (prevents loop)
      const wasTyping = this.isTyping;
      
      this.elementTag = element.tagName.toLowerCase();
      
      // Only update text if user is not actively typing
      if (!wasTyping) {
        this.elementText = element.innerText?.trim() || element.textContent?.trim() || '';
      }
      
      // Get computed styles from iframe window
      const iframeWindow = element.ownerDocument?.defaultView;
      if (!iframeWindow) {
        this.isLoadingProperties = false;
        return;
      }
      
      const computedStyle = iframeWindow.getComputedStyle(element);
      if (!computedStyle) {
        this.isLoadingProperties = false;
        return;
      }
      
      // Extract padding value (convert "16px" to 16)
      const paddingValue = computedStyle.padding;
      if (paddingValue) {
        const paddingMatch = paddingValue.match(/(\d+(?:\.\d+)?)/);
        this.padding = paddingMatch ? parseFloat(paddingMatch[1]) : 0;
      } else {
        this.padding = 0;
      }
      
      // Extract line-height value
      const lineHeightValue = computedStyle.lineHeight;
      if (lineHeightValue) {
        // Handle unitless values (e.g., "1.5") or pixel values (e.g., "24px")
        const lineHeightMatch = lineHeightValue.match(/(\d+(?:\.\d+)?)/);
        if (lineHeightMatch) {
          const numValue = parseFloat(lineHeightMatch[1]);
          // If it's a pixel value, convert to unitless by dividing by font-size
          if (lineHeightValue.includes('px')) {
            const fontSize = parseFloat(computedStyle.fontSize) || 16;
            this.lineHeight = numValue / fontSize;
          } else {
            this.lineHeight = numValue;
          }
        } else {
          this.lineHeight = 1.5;
        }
      } else {
        this.lineHeight = 1.5;
      }
    } finally {
      this.isLoadingProperties = false;
    }
  }


  updateProperty(property: string, value: string | number): void {
    if (!this.selectedElement?.id || this.isLoadingProperties) return;

    // Always get fresh element from iframe
    const iframe = document.querySelector('iframe.preview-frame') as HTMLIFrameElement;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const element = iframeDoc.getElementById(this.selectedElement.id);
    if (!element) return;
    
    // Skip property reload for text while typing (handled separately)
    const skipReload = property === 'text' && this.isTyping;
    
    switch (property) {
      case 'tag':
        // Change the tag name by creating a new element
        try {
          const newElement = iframeDoc.createElement(value as string);
          // Copy attributes
          Array.from(element.attributes).forEach(attr => {
            newElement.setAttribute(attr.name, attr.value);
          });
          // Copy children
          while (element.firstChild) {
            newElement.appendChild(element.firstChild);
          }
          // Copy styles
          newElement.style.cssText = element.style.cssText;
          // Replace the element
          element.parentNode?.replaceChild(newElement, element);
          // Update the ID if it exists
          if (this.selectedElement.id) {
            newElement.id = this.selectedElement.id;
          }
          this.elementTag = value as string;
        } catch (e) {
          console.error('Invalid tag name:', value);
        }
        break;
      case 'text':
        // Update text content immediately in iframe
        element.textContent = value as string;
        // Update local text value without reloading all properties (prevents loop)
        this.elementText = value as string;
        // Don't reload properties while typing - only save
        this.isTyping = true;
        // Clear any pending text update timeout
        if (this.textUpdateTimeout) {
          clearTimeout(this.textUpdateTimeout);
        }
        // Reload properties after user stops typing
        this.textUpdateTimeout = setTimeout(() => {
          this.isTyping = false;
          this.loadElementProperties(element);
        }, 300);
        break;
      case 'padding':
        element.style.padding = `${value}px`;
        this.padding = value as number;
        break;
      case 'lineHeight':
        element.style.lineHeight = value.toString();
        this.lineHeight = value as number;
        break;
    }

    // Only save changes, don't reload properties while typing text
    // Property reload happens after typing stops (in onTextBlur)
    if (!skipReload) {
      this.saveChanges();
    }
  }


  saveChanges(): void {
    if (!this.selectedElement?.id || this.isSaving) return;
    
    // Debounce saves to avoid too many updates
    // Longer debounce for text input to prevent loops
    const debounceTime = this.isTyping ? 500 : 100;
    
    if ((this as any).__saveTimeout) {
      clearTimeout((this as any).__saveTimeout);
    }
    
    (this as any).__saveTimeout = setTimeout(() => {
      const iframe = document.querySelector('iframe.preview-frame') as HTMLIFrameElement;
      if (!iframe) return;
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc?.body) return;
      
      const updatedHtml = iframeDoc.body.innerHTML;
      
      // Prevent saving if HTML hasn't changed (avoids loops)
      if (this.lastSavedHtml === updatedHtml) {
        return;
      }
      
      this.isSaving = true;
      this.lastSavedHtml = updatedHtml;
      
      // Use first() to automatically unsubscribe and prevent multiple subscriptions
      this.builderService.getCurrentPage().pipe(
        first()
      ).subscribe(page => {
        if (page) {
          this.builderService.updateCurrentPage(updatedHtml, page.css);
        }
        this.isSaving = false;
      });
    }, debounceTime);
  }


  onDelete(): void {
    if (!this.selectedElement?.element) return;
    
    if (confirm('Are you sure you want to delete this element?')) {
      // Get iframe document to ensure we're working with the right element
      const iframe = document.querySelector('iframe.preview-frame') as HTMLIFrameElement;
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc && this.selectedElement.id) {
          const element = iframeDoc.getElementById(this.selectedElement.id);
          if (element) {
            element.remove();
            // Save changes immediately
            this.builderService.getCurrentPage().subscribe(page => {
              if (page && iframeDoc.body) {
                const updatedHtml = iframeDoc.body.innerHTML;
                this.builderService.updateCurrentPage(updatedHtml, page.css);
              }
            }).unsubscribe();
          }
        }
      } else {
        // Fallback to direct element removal
        this.selectedElement.element.remove();
        this.saveChanges();
      }
      
      this.builderService.setSelectedElement(null);
      this.deleteElement.emit();
    }
  }

  onDuplicate(): void {
    if (!this.selectedElement?.element) return;
    
    const cloned = this.selectedElement.element.cloneNode(true) as HTMLElement;
    cloned.id = '';
    this.selectedElement.element.parentElement?.insertBefore(
      cloned,
      this.selectedElement.element.nextSibling
    );
    this.saveChanges();
    this.duplicateElement.emit();
  }

  onClose(): void {
    this.builderService.setSelectedElement(null);
  }

  // Section design/data methods
  setActiveTab(tab: 'element' | 'design' | 'data'): void {
    this.activeTab = tab;
  }

  hasSectionData(): boolean {
    return !!this.pageStore?.sectionData;
  }

  setImage(image: any): void {
    if (!this.pageStore?.sectionData) return;
    if (Array.isArray(image)) {
      if (image[0].type === 'video') {
        this.pageStore.sectionData.backgroundVideoUrl = image[0].s3Url;
      } else if (image[0].type === 'image') {
        this.pageStore.sectionData.backgroundImageUrl = image[0].s3Url;
      }
    }
  }

  saveSection(): void {
    this.eventManagerService?.savePageBuilderSection();
  }

  resetSection(): void {
    this.eventManagerService?.resetPageBuilderSection();
  }

  trackByIndex(index: number): number {
    return index;
  }

  getStylingColor(key: string): string {
    return this.mainStore?.whiteLabel?.styling?.[key] || '#ffffff';
  }

  setBackgroundColor(key: string): void {
    if (this.pageStore?.sectionData && this.mainStore?.whiteLabel?.styling?.[key]) {
      this.pageStore.sectionData.backgroundColor = this.mainStore.whiteLabel.styling[key];
    }
  }
}
