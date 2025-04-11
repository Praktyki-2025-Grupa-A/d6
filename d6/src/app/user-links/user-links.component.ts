import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-links',
  templateUrl: './user-links.component.html',
  styleUrls: ['./user-links.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class UserLinksComponent implements OnInit {
  currentUser: any = null;
  userLinks: { shortId: string, url: string, openings: number, locations: { country: string, timestamp: string }[], editing?: boolean, newUrl?: string, newShortId?: string }[] = [];
  baseUrl: string = window.location.origin;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData();
    window.addEventListener('storage', () => this.loadUserLinks());
  }

  loadUserData() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
      this.loadUserLinks();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserLinks() {
    const urlMap = JSON.parse(localStorage.getItem('urlMap') || '{}');
    this.userLinks = Object.keys(urlMap)
      .filter(shortId => urlMap[shortId].user === this.currentUser.username)
      .map(shortId => ({
        shortId,
        url: urlMap[shortId].url,
        openings: urlMap[shortId].openings || 0,
        locations: urlMap[shortId].locations || [],
        editing: false,
        newUrl: urlMap[shortId].url,
        newShortId: shortId
      }));
    console.log('Zaktualizowano userLinks:', this.userLinks);
  }

  async redirectToOriginalUrl(shortId: string) {
    const urlMap = JSON.parse(localStorage.getItem('urlMap') || '{}');
    if (urlMap[shortId]) {
      urlMap[shortId].openings = (urlMap[shortId].openings || 0) + 1;
      console.log('Zwiększono openings dla', shortId, 'na', urlMap[shortId].openings);

      if (navigator.geolocation) {
        try {
          const position = await this.getPosition();
          const country = await this.getCountry(position.coords.latitude, position.coords.longitude);
          urlMap[shortId].locations.push({ country, timestamp: new Date().toISOString() });
          console.log('Dodano lokalizację:', country);
        } catch (error) {
          urlMap[shortId].locations.push({ country: 'Unknown', timestamp: new Date().toISOString() });
          console.log('Dodano Unknown z powodu błędu:', error);
        }
      } else {
        urlMap[shortId].locations.push({ country: 'Unknown', timestamp: new Date().toISOString() });
        console.log('Dodano Unknown - brak geolokalizacji');
      }

      localStorage.setItem('urlMap', JSON.stringify(urlMap));
      this.loadUserLinks();
      console.log('Zapisano urlMap:', urlMap[shortId]);
      window.open(urlMap[shortId].url, '_blank');  
    }
  }

  deleteLink(shortId: string) {
    if (confirm('Czy na pewno chcesz usunąć ten link?')) {
      const urlMap = JSON.parse(localStorage.getItem('urlMap') || '{}');
      if (urlMap[shortId] && urlMap[shortId].user === this.currentUser.username) {
        delete urlMap[shortId];
        localStorage.setItem('urlMap', JSON.stringify(urlMap));
        this.loadUserLinks();
        console.log('Usunięto link:', shortId);
      }
    }
  }

  startEditing(link: any) {
    link.editing = true;
  }

  saveEdit(link: any) {
    if (link.newUrl && link.newShortId) {
      const urlMap = JSON.parse(localStorage.getItem('urlMap') || '{}');
      if (urlMap[link.shortId] && urlMap[link.shortId].user === this.currentUser.username) {
        if (link.newShortId !== link.shortId && urlMap[link.newShortId]) {
          alert('Ta nazwa jest już zajęta! Wybierz inną.');
          return;
        }
        const linkData = { ...urlMap[link.shortId], url: link.newUrl };
        delete urlMap[link.shortId];
        urlMap[link.newShortId] = linkData;
        localStorage.setItem('urlMap', JSON.stringify(urlMap));
        link.shortId = link.newShortId;
        link.url = link.newUrl;
        link.editing = false;
        console.log('Zaktualizowano link:', link.shortId);
      }
    } else {
      alert('Wpisz nowy URL i nazwę!');
    }
  }

  cancelEdit(link: any) {
    link.newUrl = link.url;
    link.newShortId = link.shortId;
    link.editing = false;
  }

  copyUrl(shortId: string) {
    const urlToCopy = `${this.baseUrl}/short.ly/${shortId}`;
    navigator.clipboard.writeText(urlToCopy).then(() => {
      alert('Skrócony URL skopiowany do schowka!');
    }).catch(err => {
      console.error('Błąd kopiowania:', err);
      alert('Nie udało się skopiować URL-a.');
    });
  }

  private getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  private async getCountry(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      const data = await response.json();
      return data.countryName || 'Unknown';
    } catch (error) {
      console.error('Błąd fetch:', error);
      return 'Unknown';
    }
  }
}