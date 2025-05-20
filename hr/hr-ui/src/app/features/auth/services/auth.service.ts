import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // This would be your actual API endpoint
  
  constructor(private http: HttpClient) { }
  
  login(username: string, password: string, rememberMe: boolean = false): Observable<any> {
    // For demonstration purposes, we'll simulate a successful login with a mock response
    // In a real application, you would call your API
    // return this.http.post<any>(`${this.apiUrl}/login`, { username, password, rememberMe });
    
    // Mock login - replace with actual API call
    if (username === 'admin' && password === 'password') {
      const user = { username, role: 'admin', token: 'fake-jwt-token' };
      return of(user).pipe(
        tap(user => {
          if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
          } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
          }
        })
      );
    }
    
    // Failed login
    return of(null);
  }
  
  logout(): void {
    // Remove user from local storage and session storage
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser') || !!sessionStorage.getItem('currentUser');
  }
  
  getCurrentUser(): any {
    const localUser = localStorage.getItem('currentUser');
    const sessionUser = sessionStorage.getItem('currentUser');
    
    return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
  }
} 