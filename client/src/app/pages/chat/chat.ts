import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { ChatService, ChatMessage } from '../../services/chat';

interface Message {
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

interface Conversation {
  id: number;
  title: string;
  participants: Array<{
    id: number;
    firstName: string;
    lastName: string;
  }>;
}

@Component({
  selector: 'app-chat',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  conversationId: number = 0;
  conversation: Conversation | null = null;
  messages = signal<ChatMessage[]>([]);
  newMessage: string = '';
  currentUser: any = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private chatService = inject(ChatService);
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.conversationId = +params['id'];
      this.currentUser = this.authService.getUser();
      this.initializeChat();
    });
  }

  ngOnDestroy() {
    // Clean up socket connection when leaving the chat
    this.chatService.disconnect();
  }

  initializeChat() {
    // Connect to socket
    this.chatService.connect();

    // Load conversation details
    this.loadConversation();

    // Join the conversation room
    if (this.currentUser) {
      this.chatService.joinConversation(
        this.conversationId,
        this.currentUser.firstName,
        this.currentUser.lastName
      );
    }

    // Load message history
    this.chatService.loadMessageHistory(this.conversationId);

    // Subscribe to real-time messages
    this.subscribeToMessages();
  }

  loadConversation() {
    // Load conversation details from the API
    this.authService.getConversations().subscribe({
      next: (conversations: any) => {
        // Find the current conversation from the list
        let foundConversation = null;

        if (Array.isArray(conversations)) {
          // Handle the backend's nested structure
          if (conversations.length > 0 && conversations[0].conversation) {
            foundConversation = conversations.find(
              (item: any) => item.conversation && item.conversation.id === this.conversationId
            )?.conversation;
          } else {
            foundConversation = conversations.find((conv: any) => conv.id === this.conversationId);
          }
        }

        if (foundConversation) {
          this.conversation = {
            id: foundConversation.id,
            title: foundConversation.title,
            participants: foundConversation.participants || [],
          };

          // Load participants separately if not included
          this.loadParticipants();
        } else {
          // Fallback if conversation not found
          this.conversation = {
            id: this.conversationId,
            title: `Conversation ${this.conversationId}`,
            participants: [],
          };
          this.loadParticipants();
        }
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
        // Fallback on error
        this.conversation = {
          id: this.conversationId,
          title: `Conversation ${this.conversationId}`,
          participants: [],
        };
        this.loadParticipants();
      },
    });
  }

  loadParticipants() {
    this.authService.getParticipants(this.conversationId).subscribe({
      next: (participants: any) => {
        console.log('Participants loaded:', participants);
        if (this.conversation) {
          this.conversation.participants = participants || [];
        }
      },
      error: (error) => {
        console.error('Error loading participants:', error);
        if (this.conversation) {
          this.conversation.participants = [];
        }
      },
    });
  }

  subscribeToMessages() {
    // Subscribe to the messages signal from ChatService
    this.messages = this.chatService.getMessages();
  }

  sendMessage() {
    if (this.newMessage.trim() && this.currentUser) {
      this.chatService.sendMessage(
        this.conversationId,
        this.newMessage.trim(),
        this.currentUser.firstName,
        this.currentUser.lastName
      );
      this.newMessage = ''; // Clear the input after sending
      this.scrollToBottom();
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  isCurrentUserMessage(message: ChatMessage): boolean {
    return this.currentUser && message.sender_id === this.currentUser.id;
  }

  getMessageTime(message: ChatMessage): string {
    return new Date(message.createdAt).toLocaleTimeString();
  }

  trackByMessageId(index: number, message: ChatMessage): number {
    return message.id;
  }

  getParticipantName(participant: any): string {
    if (participant.owner) {
      return `${participant.owner.firstName} ${participant.owner.lastName}`;
    } else if (participant.firstName && participant.lastName) {
      return `${participant.firstName} ${participant.lastName}`;
    }
    return 'Unknown User';
  }

  get hasParticipants(): boolean {
    return !!(this.conversation?.participants && this.conversation.participants.length > 0);
  }
}
