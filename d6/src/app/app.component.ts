import { Component, OnInit } from '@angular/core'; 
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class AppComponent implements OnInit {
  currentUser: any = null;
  isDarkMode: boolean = false; 

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateUserStatus();
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.updateUserStatus();
    this.router.navigate(['/login']);
  }

  updateUserStatus() {
    const user = localStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : null;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}