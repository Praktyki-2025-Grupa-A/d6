import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private appComponent: AppComponent) {} 

  login() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === this.username && u.password === this.password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.appComponent.updateUserStatus(); 
      this.router.navigate(['/']);
    } else {
      alert('Błędny login lub hasło!');
    }
  }
}