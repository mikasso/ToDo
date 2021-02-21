
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RegisterRequest } from '../models/RegisterRequest';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string ) { }

  register(request: RegisterRequest) {
    return this.http.post(`${this.baseUrl}api/Users`, request);
  }
}
