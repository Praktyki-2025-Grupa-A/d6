import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UrlShortenerComponent implements OnInit {
  originalUrl: string = '';
  customAlias: string = '';
  shortenedUrl: string | null = null;
  urlMap: { [key: string]: { url: string, user: string, openings: number, locations: { country: string, timestamp: string }[] } } = {};
  private baseUrl: string = window.location.origin;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    const storedMap = localStorage.getItem('urlMap');
    if (storedMap) {
      this.urlMap = JSON.parse(storedMap);
    }
    if (!localStorage.getItem('currentUser')) {
      this.router.navigate(['/login']);
    } else {
      const shortId = this.route.snapshot.paramMap.get('shortenedUrl');
      if (shortId && this.urlMap[shortId]) {
        this.updateStats(shortId);
        window.location.href = this.urlMap[shortId].url;
      }
    }
  }

  shortenUrl() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
      alert('Zaloguj się, aby skrócić URL!');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.originalUrl || !this.customAlias) {
      alert('Wpisz zarówno oryginalny URL, jak i nazwę linku!');
      return;
    }
    if (this.urlMap[this.customAlias]) {
      alert('Ta nazwa jest już zajęta! Wybierz inną.');
      return;
    }
    const shortId = this.customAlias;
    this.shortenedUrl = `${this.baseUrl}/short.ly/${shortId}`;
    this.urlMap[shortId] = { url: this.originalUrl, user: currentUser.username, openings: 0, locations: [] };
    localStorage.setItem('urlMap', JSON.stringify(this.urlMap));
    this.originalUrl = '';
    this.customAlias = '';
    this.router.navigate(['/user-links']);  
  }

  getOriginalUrl(shortenedUrl: string): string {
    const shortId = shortenedUrl.split('/').pop();
    return shortId && this.urlMap[shortId] ? this.urlMap[shortId].url : '#';
  }

  getStats(shortenedUrl: string): { openings: number, locations: { country: string, timestamp: string }[] } {
    const shortId = shortenedUrl.split('/').pop();
    return shortId && this.urlMap[shortId] 
      ? { openings: this.urlMap[shortId].openings, locations: this.urlMap[shortId].locations } 
      : { openings: 0, locations: [] };
  }

  updateStats(shortId: string) {
    if (this.urlMap[shortId]) {
      this.urlMap[shortId].openings = (this.urlMap[shortId].openings || 0) + 1;
      console.log('Zwiększono openings dla', shortId, 'na', this.urlMap[shortId].openings);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
              .then(response => response.json())
              .then(data => {
                const country = data.countryName || 'Unknown';
                this.urlMap[shortId].locations.push({ country, timestamp: new Date().toISOString() });
                localStorage.setItem('urlMap', JSON.stringify(this.urlMap));
                console.log('Dodano lokalizację:', country);
              });
          },
          () => {
            this.urlMap[shortId].locations.push({ country: 'Unknown', timestamp: new Date().toISOString() });
            localStorage.setItem('urlMap', JSON.stringify(this.urlMap));
            console.log('Dodano Unknown z powodu błędu geolokalizacji');
          }
        );
      } else {
        this.urlMap[shortId].locations.push({ country: 'Unknown', timestamp: new Date().toISOString() });
        console.log('Dodano Unknown bez geolokalizacji');
      }

      localStorage.setItem('urlMap', JSON.stringify(this.urlMap));
      console.log('Zapisano urlMap:', this.urlMap[shortId]);
    }
  }
}