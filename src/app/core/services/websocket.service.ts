import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface ChatMessage {
  id?: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  messageType: 'TEXT' | 'IMAGE' | 'FILE';
  chatRoomId?: string;
  read?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client!: Client;
  private connected = false;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private messageSubject = new Subject<ChatMessage>();
  private chatRoomsSubject = new BehaviorSubject<ChatRoom[]>([]);
  private currentRoomId: string | null = null;

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`/ws`),
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.client.onConnect = (frame) => {
      console.log('WebSocket conectado:', frame);
      this.connected = true;
      this.connectionStatus.next(true);
      this.subscribeToUserQueue();
      this.subscribeToChatRooms();
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket desconectado');
      this.connected = false;
      this.connectionStatus.next(false);
    };

    this.client.onStompError = (frame) => {
      console.error('Error STOMP:', frame);
      this.connected = false;
      this.connectionStatus.next(false);
    };
  }

  public connect(): void {
    if (!this.connected) {
      this.client.activate();
    }
  }

  public disconnect(): void {
    if (this.connected) {
      this.client.deactivate();
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  private subscribeToUserQueue(): void {
    // Suscribirse a la cola personal del usuario
    const userId = this.getCurrentUserId();
    if (userId) {
      this.client.subscribe(`/user/${userId}/queue/messages`, (message) => {
        const chatMessage = this.parseMessage(message);
        this.messageSubject.next(chatMessage);
      });
    }
  }

  private subscribeToChatRooms(): void {
    // Suscribirse a las salas de chat del usuario
    const userId = this.getCurrentUserId();
    if (userId) {
      this.client.subscribe(`/user/${userId}/queue/chat-rooms`, (message) => {
        const chatRooms = JSON.parse(message.body);
        this.chatRoomsSubject.next(chatRooms);
      });
    }
  }

  public joinChatRoom(roomId: string): void {
    if (this.connected && roomId) {
      this.currentRoomId = roomId;
      this.client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const chatMessage = this.parseMessage(message);
        this.messageSubject.next(chatMessage);
      });
    }
  }

  public leaveChatRoom(roomId: string): void {
    if (this.currentRoomId === roomId) {
      this.currentRoomId = null;
      // El cliente STOMP maneja automáticamente la desuscripción
    }
  }

  public sendMessage(message: ChatMessage): void {
    if (this.connected && this.currentRoomId) {
      const destination = `/app/chat/${this.currentRoomId}`;
      this.client.publish({
        destination,
        body: JSON.stringify(message)
      });
    }
  }

  public sendPrivateMessage(message: ChatMessage, recipientId: string): void {
    if (this.connected) {
      const destination = `/app/private-message/${recipientId}`;
      this.client.publish({
        destination,
        body: JSON.stringify(message)
      });
    }
  }

  public getMessages(): Observable<ChatMessage> {
    return this.messageSubject.asObservable();
  }

  public getChatRooms(): Observable<ChatRoom[]> {
    return this.chatRoomsSubject.asObservable();
  }

  public createChatRoom(room: Omit<ChatRoom, 'id'>): void {
    if (this.connected) {
      this.client.publish({
        destination: '/app/chat-room/create',
        body: JSON.stringify(room)
      });
    }
  }

  public joinPrivateChat(participantIds: string[]): void {
    if (this.connected) {
      this.client.publish({
        destination: '/app/private-chat/join',
        body: JSON.stringify({ participantIds })
      });
    }
  }

  private parseMessage(message: Message): ChatMessage {
    const body = JSON.parse(message.body);
    return {
      ...body,
      timestamp: new Date(body.timestamp)
    };
  }

  private getCurrentUserId(): string | null {
    // Obtener el ID del usuario desde el token o localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  }

  public markMessageAsRead(messageId: string): void {
    if (this.connected) {
      this.client.publish({
        destination: '/app/message/read',
        body: JSON.stringify({ messageId })
      });
    }
  }

  public getConnectionInfo(): { connected: boolean; clientId?: string } {
    return {
      connected: this.connected,
      clientId: this.client.connected ? this.client.connectedVersion : undefined
    };
  }
}
