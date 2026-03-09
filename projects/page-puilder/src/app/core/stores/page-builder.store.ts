import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageBuilderStore {
  private _componentData = signal<any>(null);
  private _index = signal<any>(null);
  private _sideBarIsOpen = signal<boolean>(true);
  public _sectionData = signal<any | null>(null);
  private _page = signal<any>(null);
  private _configurationTab = signal<string>('ai-builder');

  constructor() {
    effect(() => {
      const sectionData = this._sectionData();
      if (sectionData) {
        // Watch specific property: enableContainer
        if (sectionData.enableContainer !== undefined) {
          // Handle enableContainer changes
        }
      }
    });
  }

  get componentData() {
    return this._componentData();
  }

  set componentData(value: any) {
    this._componentData.set(value);
  }

  get index() {
    return this._index();
  }

  set index(value: any) {
    this._index.set(value);
  }

  get page() {
    return this._page();
  }

  set page(value: any) {
    this._page.set(value);
  }

  get sectionData() {
    return this._sectionData();
  }

  set sectionData(value: any) {
    this._sectionData.set(value);
  }

  get configurationTab() {
    return this._configurationTab();
  }

  set configurationTab(value: any) {
    this._configurationTab.set(value);
  }

  get sideBarIsOpen() {
    return this._sideBarIsOpen();
  }

  set sideBarIsOpen(value: any) {
    this._sideBarIsOpen.set(value);
  }
}
