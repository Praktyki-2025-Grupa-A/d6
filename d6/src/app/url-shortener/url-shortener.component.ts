import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importujemy CommonModule

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.css'],
  standalone: true,  // Komponent jest samodzielny
  imports: [CommonModule]  // Dodajemy CommonModule, żeby używać *ngIf
})
export class UrlShortenerComponent {
  originalUrl: string = '';
  shortenedUrl: string | null = null;

  shortenUrl() {
    if (this.originalUrl) {
      this.shortenedUrl = 'short.ly/' + Math.random().toString(36).substr(2, 9); // Prosty generator
    }
  }
}
