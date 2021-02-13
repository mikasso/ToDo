import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './../models/User';
import { getBaseUrl } from '../../main';
import { AuthenticationRequest } from '../models/AuthenticationRequest';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isLogged(): boolean {
    if (localStorage.getItem('currentToken')) return true;
    return false;
  }

  login(authRequest: AuthenticationRequest) {
    return this.http.post<User>(`${getBaseUrl()}api/Token/authenticate`, authRequest)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('currentToken', (user.token));
        this.currentUserSubject.next(user);
        console.log("logged in");
        console.log(user);
        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentToken');
    this.currentUserSubject.next(null);
  }
}
