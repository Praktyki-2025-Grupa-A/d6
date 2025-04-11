import { Routes } from '@angular/router';
import { UrlShortenerComponent } from './url-shortener/url-shortener.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { UserLinksComponent } from './user-links/user-links.component';

export const appRoutes: Routes = [
  { path: '', component: UrlShortenerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account-edit', component: AccountEditComponent },
  { path: 'user-links', component: UserLinksComponent },
  { path: 'short.ly/:shortenedUrl', component: UrlShortenerComponent }
];