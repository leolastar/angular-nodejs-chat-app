import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokens: { access?: string; refresh?: string } = {};

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('tokens');
    if (saved) this.tokens = JSON.parse(saved);
  }

  get accessToken() {
    return this.tokens.access;
  }

  signIn(email: string, password: string) {
    return this.http.post<any>(`${environment.apiBase}:${environment.port}/auth/sign-in`, {
      email,
      password,
    });
  }

  signUp(email: string, password: string, displayName: string) {
    return this.http.post<any>(`${environment.apiBase}:${environment.port}/auth/sign-up`, {
      email,
      password,
      displayName,
    });
  }

  setTokens(tokens: any) {
    this.tokens = tokens;
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  signOut() {
    this.tokens = {};
    localStorage.removeItem('tokens');
    this.router.navigate(['/']);
  }
}
