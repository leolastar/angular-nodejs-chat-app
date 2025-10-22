import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment';

export interface ChatMessage {
  id: number;
  content: string;
  sender_id: number;
  conversation_id: number;
  createdAt: string;
  sender?: {
    firstName: string;
    lastName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  socket!: Socket;
  messages = signal<ChatMessage[]>([]);
  private isConnected = false;

  connect() {
    if (this.isConnected) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }

    this.socket = io(environment.wsUrl, {
      path: environment.wsPath,
      transports: ['websocket'],
      auth: { token },
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Listen for new messages
    this.socket.on('newMessage', (data: any) => {
      const newMessage: ChatMessage = {
        id: data.message.id,
        content: data.content,
        sender_id: data.sender_id,
        conversation_id: data.conversation_id,
        createdAt: data.message.createdAt,
        sender: {
          firstName: data.message.sender?.firstName || 'Unknown',
          lastName: data.message.sender?.lastName || 'User',
        },
      };
      this.messages.update((list) => [...list, newMessage]);
    });

    // Listen for message history
    this.socket.on('history', (messages: ChatMessage[]) => {
      this.messages.set(messages);
    });

    // Listen for user joined notifications
    this.socket.on('user_joined', (data: any) => {
      console.log('User joined:', data);
    });
  }

  joinConversation(conversationId: number, firstName: string, lastName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', {
        conversation_id: conversationId,
        firstName,
        lastName,
      });
    }
  }

  sendMessage(conversationId: number, content: string, firstName: string, lastName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('sendMessage', {
        conversation_id: conversationId,
        content,
        firstName,
        lastName,
      });
    }
  }

  loadMessageHistory(conversationId: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('loadHistory', conversationId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  getMessages() {
    return this.messages;
  }
}
