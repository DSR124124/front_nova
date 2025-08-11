import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private subject: Subject<any> = new Subject<any>();

  connect(url: string): void {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      this.subject.next(JSON.parse(event.data));
    };
    this.socket.onerror = (event) => {
      this.subject.error(event);
    };
    this.socket.onclose = () => {
      this.subject.complete();
    };
  }

  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  onMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
