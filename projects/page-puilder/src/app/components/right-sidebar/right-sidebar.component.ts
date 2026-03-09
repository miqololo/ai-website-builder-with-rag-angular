import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesPanelComponent } from '../panels/properties-panel/properties-panel.component';
import { ChatPanelComponent } from '../chat-panel/chat-panel.component';
import { SelectedElement } from '../../core/models/builder.models';

export type RightSidebarTab = 'properties' | 'chat' | 'structure';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, PropertiesPanelComponent, ChatPanelComponent],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent {
  @Input() selectedElement: SelectedElement | null = null;
  @Input() activeTab: RightSidebarTab = 'chat';
  @Output() deleteElement = new EventEmitter<void>();
  @Output() duplicateElement = new EventEmitter<void>();
  @Output() tabChange = new EventEmitter<RightSidebarTab>();

  setActiveTab(tab: RightSidebarTab): void {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.tabChange.emit(tab);
    }
  }
}
