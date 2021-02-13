
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { getBaseUrl } from '../../main';
import { RegisterRequest } from '../models/RegisterRequest';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
    //  return this.http.get<User[]>(`${config.apiUrl}/users`);
  }

  register(request: RegisterRequest) {
    return this.http.post(`${getBaseUrl()}api/Users`, request);
  }

  delete(id: number) {
    //return this.http.delete(`${config.apiUrl}/users/${id}`);
  }
}
