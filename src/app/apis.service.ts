import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApisService {
  private baseUrl = 'https://createx.runasp.net/api';

  constructor(private http: HttpClient) { }

  registerMerchant(merchantData: any): Observable<any> {
    const url = `${this.baseUrl}/Company/register`;

    // Create the exact payload expected by the API
    const payload = {
      companyName: merchantData.storeName,
      email: merchantData.email,
      phoneNumber: merchantData.phoneNumber,
      password: merchantData.password
    };

    return this.http.post(url, payload);
  }

  login(loginData: any): Observable<any> {
    const url = `${this.baseUrl}/Account/login`;

    const payload = {
      email: loginData.email,
      password: loginData.password
    };

    return this.http.post(url, payload);
  }

  forgotPassword(email: string): Observable<any> {
    const url = `${this.baseUrl}/Account/forgot-password`;

    const payload = {
      email: email
    };

    return this.http.post(url, payload);
  }

  verifyOtp(email: string, otp: string): Observable<any> {
    const url = `${this.baseUrl}/Account/verify-otp`;

    const payload = {
      email: email,
      Otp: otp
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    console.log('Sending verification payload:', payload);

    return this.http.post(url, payload, { headers });
  }

  resetPassword(email: string, newPassword: string, token: string): Observable<any> {
    const url = `${this.baseUrl}/Account/reset-password`;

    console.log('Sending password reset request with token:', token);

    // Make sure the field names match exactly what the API expects
    const payload = {
      email: email,
      token: token,
      newPassword: newPassword
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    console.log('Password reset payload:', payload);

    return this.http.post(url, payload, { headers });
  }
}
