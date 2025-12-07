import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../page/user/user';

export interface Contrib {
  date: string;
  count: number;
}
@Injectable({
  providedIn: 'root',
})
export class ApiServices {

  constructor(private http: HttpClient) { }

  getUser(username: string): Observable<User> {
    return this.http.get<User>(`https://api.github.com/users/${username}`);
  }
  getRepositories(username: string): Observable<User> {
    return this.http.get<User>(`https://api.github.com/users/${username}/repos`);
  }

  getContributions(username: string): Observable<Contrib[]> {
    return this.http.get<any>(`https://github-contributions-api.jogruber.de/v4/${username}`)
  }
}
