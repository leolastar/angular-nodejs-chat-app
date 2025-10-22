import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface ConversationParticipant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Conversation {
  id: number;
  title: string;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  participants?: Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  form = new FormGroup({
    conversationTitle: new FormControl('', Validators.required),
    conversationParticipants: new FormControl([], Validators.required),
  });

  conversations: Conversation[] = [];
  allUsers: ConversationParticipant[] = [];
  filteredUsers: Observable<ConversationParticipant[]> = of([]);
  searchCtrl = new FormControl('');
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.loadConversations();
    this.loadUsers();
    this.setupUserFilter();
  }

  loadConversations() {
    this.auth.getConversations().subscribe({
      next: (conversations: any) => {
        if (Array.isArray(conversations)) {
          // Check if conversations are in the format returned by the backend
          // Backend returns array of { conversation: { id, title, ... } }
          if (conversations.length > 0 && conversations[0].conversation) {
            this.conversations = conversations.map((item: any) => item.conversation);
          } else {
            this.conversations = conversations;
          }
        } else if (conversations && conversations.data && Array.isArray(conversations.data)) {
          this.conversations = conversations.data;
        } else {
          console.warn('Unexpected conversations format:', conversations);
          this.conversations = [];
        }
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.conversations = [];
      },
    });
  }

  loadUsers() {
    this.auth.getAllUsers().subscribe({
      next: (users: any) => {
        const currentUser = this.auth.getUser();

        this.allUsers = users.filter((user: ConversationParticipant) => {
          const userId = user.id.toString();
          const currentUserId = currentUser?.id?.toString();
          return userId !== currentUserId;
        });

        this.refreshUserFilter();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  setupUserFilter() {
    this.filteredUsers = this.searchCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterUsers(value || ''))
    );

    this.searchCtrl.setValue('');
  }

  refreshUserFilter() {
    this.setupUserFilter();
  }

  get hasUsers(): boolean {
    return this.allUsers.length > 0;
  }

  // Method to manually refresh conversations
  refreshConversations() {
    this.loadConversations();
  }

  private _filterUsers(value: string): ConversationParticipant[] {
    const filterValue = value.toLowerCase();

    const filtered = this.allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(filterValue) ||
        user.lastName.toLowerCase().includes(filterValue) ||
        user.email.toLowerCase().includes(filterValue)
    );

    return filtered;
  }

  createConversation() {
    if (this.form.valid) {
      try {
        this.auth
          .createConversation(
            this.form.value.conversationTitle as string,
            this.form.value.conversationParticipants?.map((participant: ConversationParticipant) =>
              participant.id.toString()
            ) as string[],
            this.auth.getUser()?.id as string
          )
          .subscribe((conversation: any) => {
            this.form.reset();
            this.loadConversations();
            this.router.navigate(['/chat', conversation.id]);
          });
      } catch (error: any) {
        console.error(error.error?.message || 'An error occurred');
      }
    }
  }

  getParticipantName(participant: any): string {
    return `${participant.firstName} ${participant.lastName}`;
  }

  logout() {
    this.auth.signOut();
  }
}
