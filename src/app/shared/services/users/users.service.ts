import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IPaginatedResult } from '../../interfaces/paginated-result';
import { IUser } from '../../interfaces/user';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) { }

  find(page = 0): Observable<IPaginatedResult<IUser>> {
    return this.http.get<IPaginatedResult<IUser>>(`${this.#apiUrl}?page=${page}`);
  }
}
