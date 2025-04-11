import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const shortId = route.paramMap.get('shortenedUrl');
    const urlMap = JSON.parse(localStorage.getItem('urlMap') || '{}');

    console.log('RedirectGuard: shortId=', shortId, 'initial urlMap=', urlMap);

    if (shortId && urlMap[shortId]) {
      urlMap[shortId].openings = (urlMap[shortId].openings || 0) + 1;
      console.log('Po zwiększeniu openings:', urlMap[shortId].openings);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
              .then(response => response.json())
              .then(data => {
                const country = data.countryName || 'Unknown';
                const updatedMap = JSON.parse(localStorage.getItem('urlMap') || '{}');
                updatedMap[shortId].locations.push({ country, timestamp: new Date().toISOString() });
                localStorage.setItem('urlMap', JSON.stringify(updatedMap));
                console.log('Zaktualizowano z geolokalizacją:', updatedMap[shortId]);
              });
          },
          () => {
            const updatedMap = JSON.parse(localStorage.getItem('urlMap') || '{}');
            updatedMap[shortId].locations.push({ country: 'Unknown', timestamp: new Date().toISOString() });
            localStorage.setItem('urlMap', JSON.stringify(updatedMap));
            console.log('Zaktualizowano z Unknown:', updatedMap[shortId]);
          }
        );
      } else {
        urlMap[shortId].locations.push({ country: 'Unknown', timestamp: new Date().toISOString() });
        console.log('Dodano Unknown bez geolokalizacji:', urlMap[shortId]);
      }

      localStorage.setItem('urlMap', JSON.stringify(urlMap));
      console.log('Zapisano urlMap przed przekierowaniem:', JSON.parse(localStorage.getItem('urlMap') || '{}'));
      window.location.href = urlMap[shortId].url;
      return false;
    }

    console.log('Brak mapowania dla shortId:', shortId);
    return true;
  }
}