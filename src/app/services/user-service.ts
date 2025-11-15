import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
  userId: string;
  userName: string;
  userEmailId: string;
  userPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
   private apiUrl = 'http://localhost:8080/api/v1/blogsite';

  constructor(private httpClient: HttpClient) {}

  registerUser(newUser: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/user/register`, newUser)
  }

  loginUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/user/login`, user)
  }
}
