import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseURL = environment.baseUrl + 'api/me';
  private authURL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    // Make credentials
    const credentials = this.generateBasicAuthCredentials(username, password);
    // Send credentials as Authorization header (this is spring security convention for basic auth)
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest'
      })
    };

    // create request to authenticate credentials
    return this.http
      .get(this.authURL + 'authenticate', httpOptions)
      .pipe(
        tap((res) => {
          localStorage.setItem('credentials', credentials);
          return res;
        }),
        catchError((err: any) => {
          console.log(err);
          return throwError('AuthService.login(): Error logging in.');
        })
      );
  }

  register(user) {
    // create request to register a new account
    return this.http.post(this.authURL + 'register', user)
      .pipe(
        catchError((err: any) => {
          console.log(err);
          return throwError('AuthService.register(): error registering user.');
        })
      );
  }

  logout() {
    localStorage.removeItem('credentials');
  }

  checkLogin() {
    if (localStorage.getItem('credentials')) {
      return true;
    }
    return false;
  }

  generateBasicAuthCredentials(username, password) {
    return btoa(`${username}:${password}`);
  }

  getCredentials() {
    return localStorage.getItem('credentials');
  }

  getUsername() {
    return localStorage.getItem('username');
  }
}
