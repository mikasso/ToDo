import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { User } from './../models/User';
import { AuthenticationRequest } from '../models/AuthenticationRequest';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private cookieService: CookieService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get token(){
    return this.cookieService.get('token');
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isLogged(): boolean {
    if (this.cookieService.get('user')) return true;
    else return false;
  }

  public login(authRequest: AuthenticationRequest) {
    return this.http.post<User>(`${this.baseUrl}api/Token/authenticate`, authRequest)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        var exp = this.getExpireFrom(new Date(), 15);
        this.cookieService.set('user', JSON.stringify(user), exp);
        this.cookieService.set('token', (user.token), exp);
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  public logout() {
    // remove user from local storage and set current user to null
    this.cookieService.delete('user');
    this.cookieService.delete('token');
    this.currentUserSubject.next(null);
  }

  private getExpireFrom(now: Date, minutes: number = 10): Date{
    return new Date(now.getTime() + minutes * 60000);
  }
}
