import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ComponentRendererProxyComponent } from '@brandomize/core/components/component-renderer-proxy/component-renderer-proxy.component';
import {
  PButtonComponent,
  PCardComponent,
  PSectionComponent,
  PContainerComponent,
  PStackComponent,
  PRowComponent,
  PGridComponent,
  PFormComponent,
  PInputComponent,
  PTextareaComponent,
  PDropdownComponent,
  PTextComponent,
  PImageComponent,
  PCheckboxComponent,
  PRadioComponent,
  PChipComponent,
  PToggleComponent,
  PSliderComponent,
  PSpacerComponent,
  PDividerComponent,
  PLinkComponent,
  PBadgeComponent,
  PAvatarComponent,
  PIconComponent,
  PProgressComponent,
  PAlertComponent,
  PVideoComponent,
  PEmbedComponent,
  PAccordionComponent,
  PTabsComponent,
  PModalComponent,
  PBreadcrumbComponent,
  PBoxComponent
} from '@brandomize/primitives';
import type {
  PButtonConfig,
  PCardConfig,
  PSectionConfig,
  PContainerConfig,
  PStackConfig,
  PRowConfig,
  PGridConfig,
  PFormConfig,
  PInputConfig,
  PTextareaConfig,
  PDropdownConfig,
  PDropdownOption,
  PTextConfig,
  PImageConfig,
  PCheckboxConfig,
  PRadioConfig,
  PRadioOption,
  PChipConfig,
  PToggleConfig,
  PSliderConfig,
  PSpacerConfig,
  PDividerConfig,
  PLinkConfig,
  PBadgeConfig,
  PAvatarConfig,
  PIconConfig,
  PProgressConfig,
  PAlertConfig,
  PVideoConfig,
  PEmbedConfig,
  PAccordionConfig,
  PTabsConfig,
  PModalConfig,
  PBreadcrumbConfig,
  PBoxConfig
} from '@brandomize/primitives';

@Component({
  selector: 'bkit-p-component-renderer',
  standalone: true,
  imports: [
    CommonModule,
    PComponentRendererComponent,
    ComponentRendererProxyComponent,
    PButtonComponent,
    PCardComponent,
    PSectionComponent,
    PContainerComponent,
    PStackComponent,
    PRowComponent,
    PGridComponent,
    PFormComponent,
    PInputComponent,
    PTextareaComponent,
    PDropdownComponent,
    PTextComponent,
    PImageComponent,
    PCheckboxComponent,
    PRadioComponent,
    PChipComponent,
    PToggleComponent,
    PSliderComponent,
    PSpacerComponent,
    PDividerComponent,
    PLinkComponent,
    PBadgeComponent,
    PAvatarComponent,
    PIconComponent,
    PProgressComponent,
    PAlertComponent,
    PVideoComponent,
    PEmbedComponent,
    PAccordionComponent,
    PTabsComponent,
    PModalComponent,
    PBreadcrumbComponent,
    PBoxComponent
  ],
  template: `
    @switch (config?.type) {
      @case ('button') {
        <bkit-button [config]="mapButton(config)"></bkit-button>
      }
      @case ('card') {
        <bkit-card [config]="mapCard(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-card>
      }
      @case ('section') {
        <bkit-section [config]="mapSection(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-section>
      }
      @case ('container') {
        <bkit-container [config]="mapContainer(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-container>
      }
      @case ('stack') {
        <bkit-stack [config]="mapStack(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-stack>
      }
      @case ('row') {
        <bkit-row [config]="mapRow(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-row>
      }
      @case ('grid') {
        <bkit-grid [config]="mapGrid(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-grid>
      }
      @case ('form') {
        <bkit-form [config]="mapForm(config)" (submit)="onFormSubmit($event)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-form>
      }
      @case ('input') {
        <bkit-input [config]="mapInput(config)"></bkit-input>
      }
      @case ('textarea') {
        <bkit-textarea [config]="mapTextarea(config)"></bkit-textarea>
      }
      @case ('dropdown') {
        <bkit-dropdown [config]="mapDropdown(config)"></bkit-dropdown>
      }
      @case ('text') {
        <bkit-text [config]="mapText(config)"></bkit-text>
      }
      @case ('image') {
        <bkit-image [config]="mapImage(config)"></bkit-image>
      }
      @case ('checkbox') {
        <bkit-checkbox [config]="mapCheckbox(config)"></bkit-checkbox>
      }
      @case ('radio') {
        <bkit-radio [config]="mapRadio(config)"></bkit-radio>
      }
      @case ('chip') {
        <bkit-chip [config]="mapChip(config)"></bkit-chip>
      }
      @case ('toggle') {
        <bkit-toggle [config]="mapToggle(config)"></bkit-toggle>
      }
      @case ('slider') {
        <bkit-slider [config]="mapSlider(config)"></bkit-slider>
      }
      @case ('spacer') {
        <bkit-spacer [config]="mapSpacer(config)"></bkit-spacer>
      }
      @case ('divider') {
        <bkit-divider [config]="mapDivider(config)"></bkit-divider>
      }
      @case ('link') {
        <bkit-link [config]="mapLink(config)"><ng-content></ng-content></bkit-link>
      }
      @case ('badge') {
        <bkit-badge [config]="mapBadge(config)"></bkit-badge>
      }
      @case ('avatar') {
        <bkit-avatar [config]="mapAvatar(config)"></bkit-avatar>
      }
      @case ('icon') {
        <bkit-icon [config]="mapIcon(config)"></bkit-icon>
      }
      @case ('progress') {
        <bkit-progress [config]="mapProgress(config)"></bkit-progress>
      }
      @case ('alert') {
        <bkit-alert [config]="mapAlert(config)"></bkit-alert>
      }
      @case ('video') {
        <bkit-video [config]="mapVideo(config)"></bkit-video>
      }
      @case ('embed') {
        <bkit-embed [config]="mapEmbed(config)"></bkit-embed>
      }
      @case ('accordion') {
        <bkit-accordion [config]="mapAccordion(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          }
        </bkit-accordion>
      }
      @case ('tabs') {
        <bkit-tabs [config]="mapTabs(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          }
        </bkit-tabs>
      }
      @case ('modal') {
        <bkit-modal [config]="mapModal(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-modal>
      }
      @case ('breadcrumb') {
        <bkit-breadcrumb [config]="mapBreadcrumb(config)"></bkit-breadcrumb>
      }
      @case ('box') {
        <bkit-box [config]="mapBox(config)">
          @if (config?.children?.length) {
            @for (child of (config?.children ?? []); track child.id || $index) {
              @if (isPrimitiveType(child.type)) {
                <bkit-p-component-renderer [config]="child"></bkit-p-component-renderer>
              } @else {
                <bkit-component-renderer-proxy [config]="child"></bkit-component-renderer-proxy>
              }
            }
          } @else {
            <ng-content></ng-content>
          }
        </bkit-box>
      }
      @default {
        <ng-content></ng-content>
      }
    }
  `,
  styles: []
})
export class PComponentRendererComponent {
  @Input() config: ComponentConfig | null = null;

  onFormSubmit(_event: Event): void {
    // Emit or handle in parent
  }

  private readonly primitiveTypes = new Set([
    'button', 'card', 'section', 'container', 'stack', 'row', 'grid', 'form',
    'input', 'textarea', 'dropdown', 'text', 'image', 'checkbox', 'radio', 'chip',
    'toggle', 'slider', 'spacer', 'divider', 'link', 'badge', 'avatar', 'icon',
    'progress', 'alert', 'video', 'embed', 'accordion', 'tabs', 'modal', 'breadcrumb', 'box'
  ]);

  isPrimitiveType(type: string | undefined): boolean {
    return type ? this.primitiveTypes.has(type) : false;
  }

  private d(config: ComponentConfig | null): Record<string, unknown> {
    return config?.data ?? {};
  }

  mapButton(config: ComponentConfig | null): PButtonConfig {
    const d = this.d(config);
    return {
      variant: d['variant'] as PButtonConfig['variant'],
      href: d['link'] as string,
      size: d['size'] as PButtonConfig['size'],
      text: (d['text'] ?? d['label']) as string,
      ariaLabel: d['ariaLabel'] as string,
      class: config?.classes ?? []
    };
  }

  mapCard(config: ComponentConfig | null): PCardConfig {
    const d = this.d(config);
    return {
      variant: d['variant'] as PCardConfig['variant'],
      hover: d['hover'] as boolean ?? true,
      padding: d['padding'] as string,
      radius: d['radius'] as string,
      class: config?.classes ?? []
    };
  }

  mapSection(config: ComponentConfig | null): PSectionConfig {
    const d = this.d(config);
    const animateOnScrollValue = d['animateOnScroll'];
    return {
      background: d['background'] as PSectionConfig['background'],
      backgroundImage: d['backgroundImage'] as string,
      backgroundVideo: d['backgroundVideo'] as string,
      backgroundOverlay: d['backgroundOverlay'] as boolean,
      backgroundOverlayOpacity: d['backgroundOverlayOpacity'] as number,
      padding: d['padding'] as PSectionConfig['padding'],
      maxWidth: d['maxWidth'] as PSectionConfig['maxWidth'],
      animateOnScroll: typeof animateOnScrollValue === 'boolean' ? animateOnScrollValue : true, // Default to true: enable scroll animations for all sections
      class: config?.classes ?? []
    };
  }

  mapContainer(config: ComponentConfig | null): PContainerConfig {
    const d = this.d(config);
    return {
      maxWidth: d['maxWidth'] as PContainerConfig['maxWidth'],
      padding: d['padding'] as PContainerConfig['padding'],
      background: d['background'] as string,
      class: config?.classes ?? []
    };
  }

  mapStack(config: ComponentConfig | null): PStackConfig {
    const d = this.d(config);
    return {
      gap: d['gap'] as PStackConfig['gap'],
      alignItems: d['alignItems'] as PStackConfig['alignItems'],
      justifyContent: d['justifyContent'] as PStackConfig['justifyContent'],
      padding: d['padding'] as PStackConfig['padding'],
      class: config?.classes ?? []
    };
  }

  mapRow(config: ComponentConfig | null): PRowConfig {
    const d = this.d(config);
    return {
      gap: d['gap'] as PRowConfig['gap'],
      wrap: d['wrap'] as boolean ?? true,
      alignItems: d['alignItems'] as PRowConfig['alignItems'],
      justifyContent: d['justifyContent'] as PRowConfig['justifyContent'],
      padding: d['padding'] as PRowConfig['padding'],
      class: config?.classes ?? []
    };
  }

  mapGrid(config: ComponentConfig | null): PGridConfig {
    const d = this.d(config);
    return {
      columns: d['columns'] as PGridConfig['columns'],
      columnsMd: d['columnsMd'] as PGridConfig['columnsMd'],
      gap: d['gap'] as PGridConfig['gap'],
      padding: d['padding'] as PGridConfig['padding'],
      class: config?.classes ?? []
    };
  }

  mapForm(config: ComponentConfig | null): PFormConfig {
    const d = this.d(config);
    return {
      method: d['method'] as PFormConfig['method'],
      action: d['action'] as string,
      layout: d['layout'] as PFormConfig['layout'],
      gap: d['gap'] as PFormConfig['gap'],
      padding: d['padding'] as PFormConfig['padding'],
      class: config?.classes ?? []
    };
  }

  mapInput(config: ComponentConfig | null): PInputConfig {
    const d = this.d(config);
    return {
      type: d['type'] as PInputConfig['type'],
      label: d['label'] as string,
      placeholder: d['placeholder'] as string,
      required: d['required'] as boolean,
      disabled: d['disabled'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapTextarea(config: ComponentConfig | null): PTextareaConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      placeholder: d['placeholder'] as string,
      rows: d['rows'] as number,
      required: d['required'] as boolean,
      disabled: d['disabled'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapDropdown(config: ComponentConfig | null): PDropdownConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      placeholder: d['placeholder'] as string,
      options: (d['options'] ?? []) as PDropdownOption[],
      required: d['required'] as boolean,
      disabled: d['disabled'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapText(config: ComponentConfig | null): PTextConfig {
    const d = this.d(config);
    return {
      content: (d['content'] ?? d['text']) as string,
      tag: d['tag'] as PTextConfig['tag'],
      size: d['size'] as PTextConfig['size'],
      weight: d['weight'] as PTextConfig['weight'],
      color: d['color'] as string,
      align: d['align'] as PTextConfig['align'],
      highlight: d['highlight'] as string,
      class: config?.classes ?? []
    };
  }

  mapImage(config: ComponentConfig | null): PImageConfig {
    const d = this.d(config);
    return {
      src: (d['src'] ?? d['url']) as string,
      alt: d['alt'] as string,
      width: d['width'] as number | string,
      height: d['height'] as number | string,
      objectFit: d['objectFit'] as PImageConfig['objectFit'],
      rounded: d['rounded'] as PImageConfig['rounded'],
      loading: d['loading'] as PImageConfig['loading'],
      class: config?.classes ?? []
    };
  }

  mapCheckbox(config: ComponentConfig | null): PCheckboxConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      checked: d['checked'] as boolean,
      required: d['required'] as boolean,
      disabled: d['disabled'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapRadio(config: ComponentConfig | null): PRadioConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      name: d['name'] as string,
      options: (d['options'] ?? []) as PRadioOption[],
      value: d['value'] as string,
      required: d['required'] as boolean,
      disabled: d['disabled'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapChip(config: ComponentConfig | null): PChipConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      variant: d['variant'] as PChipConfig['variant'],
      size: d['size'] as PChipConfig['size'],
      closable: d['closable'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapToggle(config: ComponentConfig | null): PToggleConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      checked: d['checked'] as boolean,
      required: d['required'] as boolean,
      disabled: d['disabled'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapSlider(config: ComponentConfig | null): PSliderConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      value: d['value'] as number,
      min: d['min'] as number,
      max: d['max'] as number,
      step: d['step'] as number,
      showValue: d['showValue'] as boolean,
      showLabels: d['showLabels'] as boolean,
      required: d['required'] as boolean,
      disabled: d['disabled'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapSpacer(config: ComponentConfig | null): PSpacerConfig {
    const d = this.d(config);
    return { size: d['size'] as PSpacerConfig['size'], class: config?.classes ?? [] };
  }

  mapDivider(config: ComponentConfig | null): PDividerConfig {
    const d = this.d(config);
    return {
      orientation: d['orientation'] as PDividerConfig['orientation'],
      label: d['label'] as string,
      class: config?.classes ?? []
    };
  }

  mapLink(config: ComponentConfig | null): PLinkConfig {
    const d = this.d(config);
    return {
      href: (d['href'] ?? d['link']) as string,
      target: d['target'] as PLinkConfig['target'],
      text: (d['text'] ?? d['content']) as string,
      variant: d['variant'] as PLinkConfig['variant'],
      size: d['size'] as PLinkConfig['size'],
      ariaLabel: d['ariaLabel'] as string,
      class: config?.classes ?? []
    };
  }

  mapBadge(config: ComponentConfig | null): PBadgeConfig {
    const d = this.d(config);
    return {
      label: d['label'] as string,
      variant: d['variant'] as PBadgeConfig['variant'],
      size: d['size'] as PBadgeConfig['size'],
      rounded: d['rounded'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapAvatar(config: ComponentConfig | null): PAvatarConfig {
    const d = this.d(config);
    return {
      src: (d['src'] ?? d['url']) as string,
      alt: d['alt'] as string,
      initials: d['initials'] as string,
      size: d['size'] as PAvatarConfig['size'],
      shape: d['shape'] as PAvatarConfig['shape'],
      class: config?.classes ?? []
    };
  }

  mapIcon(config: ComponentConfig | null): PIconConfig {
    const d = this.d(config);
    const icon = config?.icon as { name?: string; size?: number } | undefined;
    return {
      name: (d['name'] ?? icon?.name ?? 'circle') as string,
      size: (d['size'] ?? icon?.size) as number | string | undefined,
      color: d['color'] as string,
      strokeWidth: d['strokeWidth'] as number,
      class: config?.classes ?? []
    };
  }

  mapProgress(config: ComponentConfig | null): PProgressConfig {
    const d = this.d(config);
    return {
      value: d['value'] as number,
      max: d['max'] as number,
      label: d['label'] as string,
      showValue: d['showValue'] as boolean,
      variant: d['variant'] as PProgressConfig['variant'],
      size: d['size'] as PProgressConfig['size'],
      class: config?.classes ?? []
    };
  }

  mapAlert(config: ComponentConfig | null): PAlertConfig {
    const d = this.d(config);
    return {
      title: d['title'] as string,
      message: d['message'] as string,
      variant: d['variant'] as PAlertConfig['variant'],
      dismissible: d['dismissible'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapVideo(config: ComponentConfig | null): PVideoConfig {
    const d = this.d(config);
    return {
      src: d['src'] as string,
      embedUrl: d['embedUrl'] as string,
      poster: d['poster'] as string,
      autoplay: d['autoplay'] as boolean,
      muted: d['muted'] as boolean,
      controls: d['controls'] as boolean,
      aspectRatio: d['aspectRatio'] as PVideoConfig['aspectRatio'],
      class: config?.classes ?? []
    };
  }

  mapEmbed(config: ComponentConfig | null): PEmbedConfig {
    const d = this.d(config);
    return {
      src: d['src'] as string,
      aspectRatio: d['aspectRatio'] as PEmbedConfig['aspectRatio'],
      class: config?.classes ?? []
    };
  }

  mapAccordion(config: ComponentConfig | null): PAccordionConfig {
    const d = this.d(config);
    return {
      items: (d['items'] ?? []) as PAccordionConfig['items'],
      allowMultiple: d['allowMultiple'] as boolean,
      variant: d['variant'] as PAccordionConfig['variant'],
      class: config?.classes ?? []
    };
  }

  mapTabs(config: ComponentConfig | null): PTabsConfig {
    const d = this.d(config);
    return {
      items: (d['items'] ?? []) as PTabsConfig['items'],
      variant: d['variant'] as PTabsConfig['variant'],
      class: config?.classes ?? []
    };
  }

  mapModal(config: ComponentConfig | null): PModalConfig {
    const d = this.d(config);
    return {
      title: d['title'] as string,
      open: d['open'] as boolean,
      size: d['size'] as PModalConfig['size'],
      closable: d['closable'] as boolean,
      class: config?.classes ?? []
    };
  }

  mapBreadcrumb(config: ComponentConfig | null): PBreadcrumbConfig {
    const d = this.d(config);
    return {
      items: (d['items'] ?? []) as PBreadcrumbConfig['items'],
      separator: d['separator'] as string,
      class: config?.classes ?? []
    };
  }

  mapBox(config: ComponentConfig | null): PBoxConfig {
    const d = this.d(config);
    return {
      padding: d['padding'] as PBoxConfig['padding'],
      margin: d['margin'] as PBoxConfig['margin'],
      background: d['background'] as string,
      border: d['border'] as boolean,
      borderRadius: d['borderRadius'] as PBoxConfig['borderRadius'],
      shadow: d['shadow'] as PBoxConfig['shadow'],
      overflow: d['overflow'] as PBoxConfig['overflow'],
      class: config?.classes ?? []
    };
  }
}
