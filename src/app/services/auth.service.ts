import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserLogin, UserRegister } from '../models/user.model';
import { throws } from 'assert';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7216/api/User'; // Adjust according to your backend API
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
    return token != null && !this.jwtHelper.isTokenExpired(token);
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
    return this.http.get('https://localhost:7216/api/protected', { headers: authHeaders});
  }
  
  //logout user
  logout(): void {
    localStorage.removeItem('jwtToken');
  }

  //Error handling method
  private handleError(error: any): Observable<never> {
    console.error('An error occured:', error);
    return throwError(() => new Error('Request failed; please try again later.'));
  }
}