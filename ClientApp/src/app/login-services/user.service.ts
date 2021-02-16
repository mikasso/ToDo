
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getBaseUrl } from '../../main';
import { RegisterRequest } from '../models/RegisterRequest';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  register(request: RegisterRequest) {
    return this.http.post(`${getBaseUrl()}api/Users`, request);
  }
}
