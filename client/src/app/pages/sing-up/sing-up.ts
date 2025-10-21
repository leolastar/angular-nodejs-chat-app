import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sing-up',
  imports: [FormsModule],
  templateUrl: './sing-up.html',
  styleUrl: './sing-up.css',
})
export class SingUp {
  email = '';
  displayName = '';
  password = '';
  private auth = inject(AuthService);
  private router = inject(Router);
  submit() {
    if (!this.email || !this.displayName || !this.password) {
      alert('Please enter your email, display name and password');
      return;
    } else if (
      this.email.trim() === '' ||
      this.displayName.trim() === '' ||
      this.password.trim() === ''
    ) {
      alert('Please enter your email, display name and password');
      return;
    }
    this.auth.signUp(this.email, this.password, this.displayName).subscribe(
      (tokens: any) => {
        this.auth.setTokens(tokens);
        this.router.navigate(['/home']);
      },
      (error) => {
        alert(error.error.message);
        console.error(error);
      }
    );
  }
}
