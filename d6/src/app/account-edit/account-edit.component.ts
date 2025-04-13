import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AccountEditComponent implements OnInit {
  currentUser: any = null;
  newUsername: string = '';
  newPassword: string = '';
  profileImage: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.newUsername = this.currentUser.username;
      this.newPassword = this.currentUser.password;
      this.profileImage = this.currentUser.profileImage || null;
    } else {
      this.router.navigate(['/login']);
    }
  }

  saveChanges() {
    if (this.newUsername && this.newPassword) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.username === this.currentUser.username);
      if (userIndex !== -1) {
        users[userIndex] = { username: this.newUsername, password: this.newPassword, profileImage: this.profileImage };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        alert('Zmiany zapisane!');
        this.router.navigate(['/']).then(() => {
          window.location.reload();  
        });
      }
    } else {
      alert('Wypełnij wszystkie pola!');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 50;
          canvas.height = 50;
          const ctx = canvas.getContext('2d');
          ctx!.drawImage(img, 0, 0, 50, 50);
          this.profileImage = canvas.toDataURL('image/png');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}