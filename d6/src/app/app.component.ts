import { Component } from '@angular/core';
import { UrlShortenerComponent } from './url-shortener/url-shortener.component';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>Witaj w aplikacji do skracania URL-i!</h1>
      <app-url-shortener></app-url-shortener>
    </div>
  `,
  styles: [],
  standalone: true,  // To jest kluczowe, żeby mówić Angularowi, że to komponent samodzielny
  imports: [UrlShortenerComponent]  // Dodajemy UrlShortenerComponent
})
export class AppComponent {
  title = 'd6';
}
