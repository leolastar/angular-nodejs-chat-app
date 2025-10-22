import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string | null = null;
  private user: User | null = null;
  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('token');
    if (saved) this.token = saved;
    const user = localStorage.getItem('user');
    if (user) this.user = JSON.parse(user);
  }

  get Token() {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  signIn(email: string, password: string) {
    return this.http.post<any>(`${environment.apiBase}/auth/login`, {
      email,
      password,
    });
  }

  signUp(email: string, password: string, firstName: string, lastName: string) {
    return this.http.post<any>(`${environment.apiBase}/auth/signup`, {
      email,
      password,
      firstName,
      lastName,
    });
  }

  setTokens(user: User, token: string) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', this.token);
    localStorage.setItem('user', JSON.stringify(this.user));
    this.router.navigate(['/home']);
  }
  getUser() {
    if (this.user) {
      return this.user;
    } else {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user);
      }
    }
    return this.user;
  }

  signOut() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokens'); // Clean up any old tokens key
    this.router.navigate(['/']);
  }

  // Method to handle token expiration
  handleTokenExpiration() {
    this.signOut();
  }

  getConversations() {
    const userId = this.getUser()?.id;
    const url = `${environment.apiBase}/conversations/conversations/${userId}`;
    return this.http.get<any>(url);
  }

  createConversation(title: string, participants: string[], owner: string) {
    return this.http.post<any>(`${environment.apiBase}/conversations/conversation`, {
      title,
      participants,
      owner,
    });
  }

  getMessages(conversationId: number) {
    return this.http.post<any>(`${environment.apiBase}/messages/messages`, {
      conversation_id: conversationId,
    });
  }

  getParticipants(conversationId: number) {
    return this.http.get<any>(
      `${environment.apiBase}/conversations/participants/${conversationId}`
    );
  }

  createMessage(conversationId: number, content: string, senderId: string) {
    return this.http.post<any>(`${environment.apiBase}/messages/message`, {
      content,
      senderId,
      conversation_id: conversationId,
    });
  }

  getAllUsers() {
    return this.http.get<any>(`${environment.apiBase}/users/users`);
  }

  getUserConversations(userId: string) {
    return this.http.get<any>(`${environment.apiBase}/conversations/conversations/${userId}`);
  }
}
