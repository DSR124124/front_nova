import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';
import { ChatMessage } from '../../../../core/services/websocket.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  standalone: false
})
export class MessageListComponent implements AfterViewChecked, OnChanges {
  @Input() messages: ChatMessage[] = [];
  @Input() currentUserId: string | null = null;
  @Input() loading: boolean = false;
  @Output() messageRead = new EventEmitter<string>();

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] && changes['messages'].currentValue) {
      // Marcar mensajes como leídos cuando se cargan
      this.messages.forEach(message => {
        if (message.senderId !== this.currentUserId && !message.read) {
          this.messageRead.emit(message.id || '');
        }
      });
    }
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id || index.toString();
  }

  isOwnMessage(message: ChatMessage): boolean {
    return message.senderId === this.currentUserId;
  }

  getMessageTime(message: ChatMessage): string {
    const now = new Date();
    const messageDate = new Date(message.timestamp);

    if (now.toDateString() === messageDate.toDateString()) {
      return messageDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  getMessageStatus(message: ChatMessage): string {
    if (this.isOwnMessage(message)) {
      return 'Enviado'; // En una implementación real, esto vendría del backend
    }
    return '';
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      // Ignorar errores de scroll
    }
  }
}
