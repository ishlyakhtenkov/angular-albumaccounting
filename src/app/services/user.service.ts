import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../common/user';
import { UserTo } from '../common/user-to';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  getUser(userId: number): Observable<User>{
    return this.httpClient.get<User>(`${this.baseUrl}/${userId}`);
  }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }

  updateUser(userTo: UserTo): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/${userTo.id}`, userTo);
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${userId}`);
  }

  enableUser(userId: number, enabled: boolean): Observable<any> {
    const enabledQueryParam = `?enabled=${enabled}`;
    return this.httpClient.patch<any>(`${this.baseUrl}/${userId}${enabledQueryParam}`, {});
  }

  changeUserPassword(userId: number, password: string): Observable<any> {
    const passwordQueryParam = `?password=${password}`;
    return this.httpClient.patch<any>(`${this.baseUrl}/${userId}/password${passwordQueryParam}`, {});
  }
}