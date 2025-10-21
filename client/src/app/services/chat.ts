import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

export interface ChatMessage {
  room: string;
  body: string;
  sender: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  socket!: Socket;
  messages = signal<ChatMessage[]>([]);

  connect() {
    const tokens = localStorage.getItem('tokens');
    const access = tokens ? JSON.parse(tokens).access : undefined;
    this.socket = io(environment.wsUrl, {
      path: environment.wsPath,
      transports: ['websocket'],
      auth: { token: access },
    });

    this.socket.on('message', (msg: ChatMessage) => {
      this.messages.update((list) => [...list, msg]);
    });

    this.socket.on('presence', (p: any) => {
      this.messages.update((list) => [
        ...list,
        {
          room: 'general',
          body: `${p.user} ${p.action}`,
          sender: 'system',
          created_at: new Date().toISOString(),
        },
      ]);
    });
  }

  send(body: string, room = 'general') {
    this.socket.emit('message', { body, room });
  }
}
