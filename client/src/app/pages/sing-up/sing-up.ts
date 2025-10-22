import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-sing-up',
  imports: [FormsModule, RouterLink],
  templateUrl: './sing-up.html',
  styleUrl: './sing-up.css',
})
export class SingUp {
  email = '';
  firstName = '';
  lastName = '';
  password = '';
  private auth = inject(AuthService);
  private router = inject(Router);
  submit() {
    if (!this.email || !this.firstName || !this.lastName || !this.password) {
      alert('Please enter your email, first name, last name and password');
      return;
    } else if (
      this.email.trim() === '' ||
      this.firstName.trim() === '' ||
      this.lastName.trim() === '' ||
      this.password.trim() === ''
    ) {
      alert('Please enter your email, first name, last name and password');
      return;
    }
    this.auth.signUp(this.email, this.password, this.firstName, this.lastName).subscribe(
      (user: any) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        alert(error.error.message);
        console.error(error);
      }
    );
  }
}
