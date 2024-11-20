import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, LoginCredentials, TokenResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private readonly API_URL = 'http://localhost:8080/auth';
  private readonly API_URL = 'https://twelveshockcrmb.onrender.com/auth';
  private readonly TOKEN_KEY = 'jwt_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggingInSubject = new BehaviorSubject<boolean>(false);

  // Observable para el estado de login
  isLoggingIn$ = this.isLoggingInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  // Getter para verificar si está loggeado
  get isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get isLoggingIn(): boolean {
    return this.isLoggingInSubject.value;
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  login(credentials: LoginCredentials): Observable<TokenResponse> {
    this.isLoggingInSubject.next(true);
    return this.http.post<TokenResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.isLoggingInSubject.next(false);
          // Actualizar el estado de isLoggedIn
          this.currentUserSubject.next({ username: credentials.username } as User);
        }),
        catchError(error => {
          this.isLoggingInSubject.next(false);
          return throwError(error);
        })
      );
  }

  signup(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/signup`, user);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.isLoggingInSubject.next(false);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      // Aquí podrías hacer una llamada al backend para validar el token
      // o decodificar el JWT para obtener la información del usuario
    }
  }
}
