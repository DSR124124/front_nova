import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked, OnChanges, SimpleChanges } from '@angular/core';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  isOwn?: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

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
  @Input() emptyStateMessage: string = 'No hay mensajes en esta conversación';
  @Input() emptyStateSubMessage: string = '¡Sé el primero en escribir!';

  @Output() messageRead = new EventEmitter<string>();
  @Output() messageDeleted = new EventEmitter<string>();
  @Output() messageReactionAdded = new EventEmitter<{messageId: string, reaction: string}>();

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages'] && changes['messages'].currentValue) {
      // Marcar mensajes como leídos automáticamente
      this.markUnreadMessagesAsRead();
    }
  }

  private markUnreadMessagesAsRead(): void {
    this.messages.forEach(message => {
      if (!this.isOwnMessage(message) && message.status !== 'read') {
        this.messageRead.emit(message.id);
      }
    });
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id || index.toString();
  }

  isOwnMessage(message: ChatMessage): boolean {
    return message.senderId === this.currentUserId || message.isOwn === true;
  }

  getMessageTime(message: ChatMessage): string {
    const now = new Date();
    const messageDate = new Date(message.timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      // Mostrar solo hora si es del mismo día
      return messageDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 168) { // 7 días
      // Mostrar día de la semana y hora
      return messageDate.toLocaleDateString('es-ES', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      // Mostrar fecha completa
      return messageDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  getMessageStatusText(message: ChatMessage): string {
    if (!this.isOwnMessage(message)) return '';

    switch (message.status) {
      case 'sent': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'read': return 'Leído';
      default: return 'Enviando...';
    }
  }

  getMessageStatusIcon(message: ChatMessage): string {
    if (!this.isOwnMessage(message)) return '';

    switch (message.status) {
      case 'sent': return 'pi pi-check';
      case 'delivered': return 'pi pi-check-circle';
      case 'read': return 'pi pi-eye';
      default: return 'pi pi-clock';
    }
  }

  getSenderInitials(senderName: string): string {
    return senderName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  deleteMessage(messageId: string): void {
    this.messageDeleted.emit(messageId);
  }

  addReaction(messageId: string, reaction: string): void {
    this.messageReactionAdded.emit({ messageId, reaction });
  }

  copyMessageContent(content: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        // Podrías emitir un evento para mostrar un toast
      });
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer?.nativeElement) {
        const element = this.messageContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      // Ignorar errores de scroll
    }
  }

  scrollToTop(): void {
    try {
      if (this.messageContainer?.nativeElement) {
        this.messageContainer.nativeElement.scrollTop = 0;
      }
    } catch (err) {
      // Ignorar errores de scroll
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  shouldShowDateSeparator(message: ChatMessage, index: number): boolean {
    if (index === 0) return true;

    const currentDate = new Date(message.timestamp);
    const previousDate = new Date(this.messages[index - 1].timestamp);

    return currentDate.toDateString() !== previousDate.toDateString();
  }

  formatDateSeparator(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  }

  getMessageActions(message: ChatMessage): any[] {
    return [
      {
        label: 'Copiar texto',
        icon: 'pi pi-copy',
        command: () => this.copyMessageContent(message.content)
      },
      {
        label: 'Reaccionar',
        icon: 'pi pi-heart',
        items: [
          {
            label: '👍',
            command: () => this.addReaction(message.id, '👍')
          },
          {
            label: '❤️',
            command: () => this.addReaction(message.id, '❤️')
          },
          {
            label: '😂',
            command: () => this.addReaction(message.id, '😂')
          },
          {
            label: '😮',
            command: () => this.addReaction(message.id, '😮')
          }
        ]
      },
      {
        separator: true
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.deleteMessage(message.id)
      }
    ];
  }
}
