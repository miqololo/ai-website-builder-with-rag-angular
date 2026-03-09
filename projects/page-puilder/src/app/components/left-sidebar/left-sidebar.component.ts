import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule, PanelTopOpen, PanelBottomOpen, Folder, Box, FileText, LayoutTemplate, X, Navigation, Settings, ArrowLeft, Palette, LayoutGrid } from 'lucide-angular';
import { ResourcesPanelComponent } from '../panels/resources-panel/resources-panel.component';
import { SettingsPanelComponent } from '../panels/settings-panel/settings-panel.component';

export type SidebarTab = 'header' | 'footer' | 'resources' | 'components' | 'pages' | 'templates' | 'layouts' | 'navigation' | 'theme' | 'settings';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ResourcesPanelComponent,
    SettingsPanelComponent
],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  @Output() tabSelected = new EventEmitter<SidebarTab>();
  @Input() activeTabFromRoute: SidebarTab | null = null;
  
  activeTab: SidebarTab | null = null;
  isCollapsed = false;
  
  // Lucide icons
  PanelTopOpen = PanelTopOpen;
  PanelBottomOpen = PanelBottomOpen;
  Folder = Folder;
  Box = Box;
  FileText = FileText;
  LayoutTemplate = LayoutTemplate;
  LayoutGrid = LayoutGrid;
  Navigation = Navigation;
  Settings = Settings;
  ArrowLeft = ArrowLeft;
  X = X;
  
  tabs: { id: SidebarTab; label: string; icon: any }[] = [
    { id: 'theme', label: 'Theme', icon: Palette },
    // { id: 'header', label: 'Header', icon: PanelTopOpen },
    // { id: 'footer', label: 'Footer', icon: PanelBottomOpen },
    // { id: 'layouts', label: 'Layouts', icon: LayoutGrid },
    { id: 'components', label: 'Components', icon: Box },
    // { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'resources', label: 'Resources', icon: Folder },
    // { id: 'navigation', label: 'Navigation', icon: Navigation },
    { id: 'settings', label: 'Settings', icon: Settings },
    // { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Restore active tab from route query params
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      if (tabParam && this.isValidTab(tabParam)) {
        const tab = tabParam as SidebarTab;
        this.activeTab = tab;
        this.isCollapsed = true;
        this.tabSelected.emit(tab);
      } else {
        this.activeTab = null;
        this.isCollapsed = false;
      }
    });
  }

  setActiveTab(tab: SidebarTab): void {
    if (this.activeTab === tab) {
      // Close panel and expand sidebar
      this.activeTab = null;
      this.isCollapsed = false;
      this.tabSelected.emit(null as any);
      // Update route
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: null },
        queryParamsHandling: 'merge'
      });
    } else {
      // Open panel and collapse sidebar
      this.activeTab = tab;
      this.isCollapsed = true;
      this.tabSelected.emit(tab);
      // Update route
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab },
        queryParamsHandling: 'merge'
      });
    }
  }

  closePanel(): void {
    this.activeTab = null;
    this.isCollapsed = false;
    this.tabSelected.emit(null as any);
    // Update route
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: null },
      queryParamsHandling: 'merge'
    });
  }

  onBackClick(): void {
    // Navigation logic will be implemented later
    // For now, this is a placeholder
  }

  private isValidTab(tab: string): boolean {
    return ['header', 'footer', 'resources', 'components', 'pages', 'templates', 'layouts', 'navigation', 'settings', 'theme'].includes(tab);
  }
}
