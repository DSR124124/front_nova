import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketService, ChatMessage, ChatRoom } from '../../../../core/services/websocket.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  standalone: false
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: ChatMessage[] = [];
  chatRooms: ChatRoom[] = [];
  currentRoom: ChatRoom | null = null;
  newMessage: string = '';
  isConnected: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  private subscriptions: Subscription[] = [];
  currentUserId: string | null = null;
  currentUserName: string | null = null;

  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.currentUserId = user?.sub || user?.userId || null;
    this.currentUserName = user?.name || user?.username || 'Usuario';
    this.initializeChat();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.currentRoom) {
      this.webSocketService.leaveChatRoom(this.currentRoom.id);
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id || index.toString();
  }

  private initializeChat(): void {
    this.loading = true;

    // Conectar al WebSocket
    this.webSocketService.connect();

    // Cargar salas de chat existentes
    this.loadChatRooms();
  }

  private setupSubscriptions(): void {
    // Estado de conexión
    this.subscriptions.push(
      this.webSocketService.getConnectionStatus().subscribe(
        connected => {
          this.isConnected = connected;
          if (connected) {
            this.loading = false;
            this.error = null;
          }
        }
      )
    );

    // Mensajes entrantes
    this.subscriptions.push(
      this.webSocketService.getMessages().subscribe(
        message => {
          this.messages.push(message);
          this.updateChatRoomLastMessage(message);
        }
      )
    );

    // Salas de chat
    this.subscriptions.push(
      this.webSocketService.getChatRooms().subscribe(
        rooms => {
          this.chatRooms = rooms;
          this.loading = false;
        }
      )
    );
  }

  private loadChatRooms(): void {
    // En una implementación real, esto vendría del backend
    // Por ahora, creamos algunas salas de ejemplo
    this.chatRooms = [
      {
        id: '1',
        name: 'Chat General',
        participants: [this.currentUserId || ''],
        unreadCount: 0
      },
      {
        id: '2',
        name: 'Chat Privado',
        participants: [this.currentUserId || ''],
        unreadCount: 2
      }
    ];
  }

  selectChatRoom(room: ChatRoom): void {
    if (this.currentRoom) {
      this.webSocketService.leaveChatRoom(this.currentRoom.id);
    }

    this.currentRoom = room;
    this.messages = [];
    this.webSocketService.joinChatRoom(room.id);

    // Marcar mensajes como leídos
    if (room.unreadCount > 0) {
      this.markRoomAsRead(room.id);
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.currentRoom || !this.currentUserId) {
      return;
    }

    const message: ChatMessage = {
      senderId: this.currentUserId,
      senderName: this.currentUserName || 'Usuario',
      content: this.newMessage.trim(),
      timestamp: new Date(),
      messageType: 'TEXT',
      chatRoomId: this.currentRoom.id
    };

    this.webSocketService.sendMessage(message);
    this.newMessage = '';
  }

  sendPrivateMessage(recipientId: string, content: string): void {
    if (!content.trim() || !this.currentUserId) {
      return;
    }

    const message: ChatMessage = {
      senderId: this.currentUserId,
      senderName: this.currentUserName || 'Usuario',
      content: content.trim(),
      timestamp: new Date(),
      messageType: 'TEXT'
    };

    this.webSocketService.sendPrivateMessage(message, recipientId);
  }

  createChatRoom(roomName: string, participants: string[]): void {
    const newRoom: Omit<ChatRoom, 'id'> = {
      name: roomName,
      participants: [...participants, this.currentUserId || ''],
      unreadCount: 0
    };

    this.webSocketService.createChatRoom(newRoom);
  }

  private markRoomAsRead(roomId: string): void {
    // Actualizar el contador de mensajes no leídos
    const room = this.chatRooms.find(r => r.id === roomId);
    if (room) {
      room.unreadCount = 0;
    }
  }

  private updateChatRoomLastMessage(message: ChatMessage): void {
    if (message.chatRoomId) {
      const room = this.chatRooms.find(r => r.id === message.chatRoomId);
      if (room) {
        room.lastMessage = message;
        if (message.senderId !== this.currentUserId) {
          room.unreadCount++;
        }
      }
    }
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      // Ignorar errores de scroll
    }
  }

  getConnectionStatusText(): string {
    return this.isConnected ? 'Conectado' : 'Desconectado';
  }

  getConnectionStatusClass(): string {
    return this.isConnected ? 'connected' : 'disconnected';
  }

  reconnect(): void {
    this.webSocketService.connect();
  }
}
