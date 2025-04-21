import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Login method
  login(credentials: { email: string; password: string; rememberMe?: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // You can add more authentication methods here
  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  // Method to check if user is logged in
  isLoggedIn(): boolean {
    // Check if token exists in localStorage or sessionStorage
    return !!localStorage.getItem('auth_token');
  }

  // Store token after successful login
  storeToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem('auth_token', token);
    } else {
      sessionStorage.setItem('auth_token', token);
    }
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }
}
