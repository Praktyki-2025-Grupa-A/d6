import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'], 
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  register() {
    if (this.username && this.password) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.username === this.username)) {
        alert('Użytkownik już istnieje!');
        return;
      }
      users.push({ username: this.username, password: this.password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Rejestracja udana! Zaloguj się.');
      this.router.navigate(['/login']);
    }
  }
}