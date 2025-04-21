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
  
  login(username: string, password: string): Observable<any> {
    // For demonstration purposes, we'll simulate a successful login with a mock response
    // In a real application, you would call your API
    // return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
    
    // Mock login - replace with actual API call
    if (username === 'admin' && password === 'password') {
      const user = { username, role: 'admin', token: 'fake-jwt-token' };
      return of(user).pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
    }
    
    // Failed login
    return of(null);
  }
  
  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
  
  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
} 