import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const config = [
  provideRouter(appRoutes)  
];
