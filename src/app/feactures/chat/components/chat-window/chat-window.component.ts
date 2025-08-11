import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { MessageService } from 'primeng/api';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  isOwn?: boolean;
}

interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  unreadCount: number;
}

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  standalone: false
})
export class ChatWindowComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: ChatMessage[] = [];
  contacts: ChatContact[] = [];
  currentContact: ChatContact | null = null;
  newMessage: string = '';
  loading: boolean = false;

  // Usuario actual (simulado)
  currentUser = {
    id: 'user1',
    name: 'Tú'
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadInitialMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private loadContacts(): void {
    // Simulamos contactos de ejemplo
    this.contacts = [
      {
        id: 'contact1',
        name: 'María González',
        status: 'online',
        unreadCount: 3
      },
      {
        id: 'contact2',
        name: 'Juan Pérez',
        status: 'away',
        lastSeen: new Date(Date.now() - 3600000), // 1 hora atrás
        unreadCount: 0
      },
      {
        id: 'contact3',
        name: 'Ana Silva',
        status: 'offline',
        lastSeen: new Date(Date.now() - 86400000), // 1 día atrás
        unreadCount: 1
      }
    ];
  }

  private loadInitialMessages(): void {
    // Mensajes de ejemplo
    this.messages = [
      {
        id: '1',
        senderId: 'contact1',
        senderName: 'María González',
        content: '¡Hola! ¿Cómo estás?',
        timestamp: new Date(Date.now() - 3600000),
        messageType: 'TEXT'
      },
      {
        id: '2',
        senderId: 'user1',
        senderName: 'Tú',
        content: '¡Hola María! Todo bien, ¿y tú?',
        timestamp: new Date(Date.now() - 3500000),
        messageType: 'TEXT',
        isOwn: true
      },
      {
        id: '3',
        senderId: 'contact1',
        senderName: 'María González',
        content: 'Perfecto, aquí trabajando en algunos proyectos',
        timestamp: new Date(Date.now() - 3400000),
        messageType: 'TEXT'
      }
    ];
  }

  selectContact(contact: ChatContact): void {
    this.currentContact = contact;

    // Marcar mensajes como leídos
    if (contact.unreadCount > 0) {
      contact.unreadCount = 0;
    }

    // Simular carga de mensajes para este contacto
    this.loadMessagesForContact(contact.id);
  }

  private loadMessagesForContact(contactId: string): void {
    // En una implementación real, cargarías los mensajes del backend
    // Por ahora simulamos algunos mensajes
    if (contactId === 'contact1') {
      this.messages = [
        {
          id: '1',
          senderId: 'contact1',
          senderName: 'María González',
          content: '¡Hola! ¿Cómo estás?',
          timestamp: new Date(Date.now() - 3600000),
          messageType: 'TEXT'
        },
        {
          id: '2',
          senderId: 'user1',
          senderName: 'Tú',
          content: '¡Hola María! Todo bien, ¿y tú?',
          timestamp: new Date(Date.now() - 3500000),
          messageType: 'TEXT',
          isOwn: true
        }
      ];
    } else if (contactId === 'contact2') {
      this.messages = [
        {
          id: '10',
          senderId: 'contact2',
          senderName: 'Juan Pérez',
          content: 'Oye, ¿viste el partido de ayer?',
          timestamp: new Date(Date.now() - 7200000),
          messageType: 'TEXT'
        }
      ];
    } else {
      this.messages = [];
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.currentContact) {
      return;
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      content: this.newMessage.trim(),
      timestamp: new Date(),
      messageType: 'TEXT',
      isOwn: true
    };

    this.messages.push(message);
    this.newMessage = '';

    // Simular respuesta automática después de un momento
    this.simulateResponse();

    this.messageService.add({
      severity: 'success',
      summary: 'Mensaje enviado',
      life: 2000
    });
  }

  private simulateResponse(): void {
    if (!this.currentContact) return;

    // Simular que el contacto está escribiendo
    setTimeout(() => {
      const responses = [
        '¡Perfecto!',
        'Entendido 👍',
        'Me parece bien',
        '¿En serio? 😮',
        'Jajaja 😄',
        'Claro, cuando quieras',
        'Gracias por contarme'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const responseMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: this.currentContact!.id,
        senderName: this.currentContact!.name,
        content: randomResponse,
        timestamp: new Date(),
        messageType: 'TEXT'
      };

      this.messages.push(responseMessage);
    }, 1000 + Math.random() * 2000); // Respuesta entre 1-3 segundos
  }

  private scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Ignorar errores de scroll
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'online': return 'pi pi-circle-fill';
      case 'away': return 'pi pi-circle-fill';
      case 'offline': return 'pi pi-circle';
      default: return 'pi pi-circle';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'online': return 'var(--green-500)';
      case 'away': return 'var(--orange-500)';
      case 'offline': return 'var(--surface-400)';
      default: return 'var(--surface-400)';
    }
  }

  getContactInitials(name: string): string {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  }

  formatLastSeen(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  }

  onMessageKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  deleteMessage(messageId: string): void {
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index > -1) {
      this.messages.splice(index, 1);
      this.messageService.add({
        severity: 'info',
        summary: 'Mensaje eliminado',
        life: 2000
      });
    }
  }
}
