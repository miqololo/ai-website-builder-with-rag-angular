import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainStoreService {
  private _whiteLabel = signal<any>(null);

  constructor() {}

  get whiteLabel() {
    return this._whiteLabel();
  }

  set whiteLabel(value: any) {
    this._whiteLabel.set(value);
  }
}
