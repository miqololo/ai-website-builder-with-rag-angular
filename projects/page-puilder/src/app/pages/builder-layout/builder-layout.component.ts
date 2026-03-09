import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PreviewAreaComponent } from '../../components/preview-area/preview-area.component';
import { RightSidebarComponent, RightSidebarTab } from '../../components/right-sidebar/right-sidebar.component';
import { SelectedElement, Page } from '../../core/models/builder.models';
import { LucideAngularModule } from 'lucide-angular';
import { SidebarTab } from '../../components/left-sidebar/left-sidebar.component';

@Component({
  selector: 'app-builder-layout',
  standalone: true,
  imports: [LucideAngularModule, PreviewAreaComponent, RightSidebarComponent],
  templateUrl: './builder-layout.component.html',
  styleUrls: ['./builder-layout.component.scss']
})
export class BuilderLayoutComponent implements OnInit, OnDestroy {
  activeTab: SidebarTab | null = null;
  selectedElement: SelectedElement | null = null;
  rightSidebarTab: RightSidebarTab = 'chat';
  currentPage: Page | null = null;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
   
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onTabSelected(tab: SidebarTab | null): void {
    this.activeTab = tab;
  }

  onElementDeleted(): void {
    this.selectedElement = null;
   
  }

  onElementDuplicated(): void {
    // Element duplication is handled by the properties panel
  }

  onRightSidebarTabChange(tab: RightSidebarTab): void {
    this.rightSidebarTab = tab;
  }
}
