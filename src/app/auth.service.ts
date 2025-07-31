import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7166/api';

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;



  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject(
      localStorage.getItem('currentUser') ? 
      JSON.parse(localStorage.getItem('currentUser')!) : 
      null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }


  login(username:any ,password:any): Observable<any> {

    return this.http.post(`${this.apiUrl}/login/login`, {username:username, password:password})
    .pipe(
      tap(response => {
  
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      })
    );
  }


  logout() {
    // מחיקת הטוקן בעת התנתקות
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.token : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
