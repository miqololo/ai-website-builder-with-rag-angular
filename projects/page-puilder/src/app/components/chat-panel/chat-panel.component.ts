import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { BuilderService } from '../../core/services/builder.service';
import { ChatMessage, SelectedElement } from '../../core/models/builder.models';

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss']
})
export class ChatPanelComponent implements OnInit, OnDestroy {
  X = X;
  @ViewChild('chatMessages', { static: false }) chatMessagesRef!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInputRef!: ElementRef<HTMLInputElement>;

  messages: ChatMessage[] = [];
  selectedElement: SelectedElement | null = null;
  userInput = '';
  private subscriptions = new Subscription();

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.builderService.getChatMessages().subscribe(messages => {
        this.messages = messages;
        // Scroll to bottom when new messages arrive
        setTimeout(() => this.scrollToBottom(), 50);
      })
    );

    this.subscriptions.add(
      this.builderService.getSelectedElement().subscribe(element => {
        this.selectedElement = element;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const message = this.userInput.trim();
    this.userInput = '';
    
    // Focus back on input after sending
    setTimeout(() => {
      this.messageInputRef?.nativeElement?.focus();
    }, 100);

    this.builderService.sendAIMessage(message, this.selectedElement || undefined);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearSelection(): void {
    this.builderService.setSelectedElement(null);
  }

  getSelectedElementDescription(): string {
    if (!this.selectedElement) return '';
    return this.selectedElement.type === 'section' 
      ? 'Selected Section' 
      : `Selected Component: ${this.selectedElement.id}`;
  }

  scrollToBottom(): void {
    if (this.chatMessagesRef?.nativeElement) {
      this.chatMessagesRef.nativeElement.scrollTop = 
        this.chatMessagesRef.nativeElement.scrollHeight;
    }
  }
}
