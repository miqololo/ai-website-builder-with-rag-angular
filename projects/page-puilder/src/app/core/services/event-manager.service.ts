import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {
  public savePageBuilderSectionEmitter: EventEmitter<any> = new EventEmitter();
  public resetPageBuilderSectionEmitter: EventEmitter<any> = new EventEmitter();

  savePageBuilderSection(): void {
    this.savePageBuilderSectionEmitter.emit();
  }

  resetPageBuilderSection(): void {
    this.resetPageBuilderSectionEmitter.emit();
  }
}
