import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserLogin, UserRegister } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { getApiUrl } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = getApiUrl('User'); // Dynamically resolved backend URL
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  // Register user
  registerUser(user: UserRegister): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Login user
  loginUser(user: UserLogin): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Storing token in local storage
  storeToken(token: string) : void {
    if(typeof window !== 'undefined')
    {
      localStorage.setItem('jwtToken', token);
    }
    
  }

  // Get token from local storage
  getToken(): string | null {
    if(typeof window !== 'undefined')
    {
     return localStorage.getItem('jwtToken');
    }
    return null;
  }

  //Check if user is authentiicated
  isAuthenticated(){
    const token = this.getToken();
    if (!token) return false;
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      return false;
    }
  }

  //Set headers with token for autenticated requests
  createAuthorizationHeader(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if(token){
      return headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  // authenticated request
  getProtectedData() : Observable<any> {
    const headers = new HttpHeaders();
    const authHeaders = this.createAuthorizationHeader(headers);
    return this.http.get(getApiUrl('protected'), { headers: authHeaders});
  }
  
  //logout user
  logout(): void {
    localStorage.removeItem('jwtToken');
  }

  // Forgot password — returns token in dev mode
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  // Reset password with token
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword }).pipe(
      catchError(this.handleError)
    );
  }

  // Google OAuth login
  googleLogin(credential: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/google-login`, { credential }).pipe(
      catchError(this.handleError)
    );
  }

  //Error handling method
  private handleError(error: any): Observable<never> {
    console.error('An error occured:', error);
    return throwError(() => new Error('Request failed; please try again later.'));
  }
}