import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sing-in',
  imports: [FormsModule],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.css',
})
export class SingIn {
  email = '';
  password = '';
  private auth = inject(AuthService);
  private router = inject(Router);
  submit() {
    if (!this.email || !this.password) {
      alert('Please enter your email and password');
      return;
    } else if (this.email.trim() === '' || this.password.trim() === '') {
      alert('Please enter your email and password');
      return;
    }
    this.auth.signIn(this.email, this.password).subscribe((tokens: any) => {
      this.auth.setTokens(tokens);
      this.router.navigate(['/home']);
    });
  }
}
