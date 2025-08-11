import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css'],
  standalone: false
})
export class MessageInputComponent {
  @Input() placeholder: string = 'Escribe un mensaje...';
  @Input() messageText: string = '';
  @Output() messageTextChange = new EventEmitter<string>();
  @Output() messageSent = new EventEmitter<void>();
  @ViewChild('messageInput') messageInput!: ElementRef;

  onMessageTextChange(value: string): void {
    this.messageText = value;
    this.messageTextChange.emit(value);
  }

  sendMessage(): void {
    if (this.messageText.trim()) {
      this.messageSent.emit();
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  focusInput(): void {
    this.messageInput?.nativeElement?.focus();
  }

  clearInput(): void {
    this.messageText = '';
    this.messageTextChange.emit('');
    this.focusInput();
  }
}
