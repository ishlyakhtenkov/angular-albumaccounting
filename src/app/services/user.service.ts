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

  private usersUrl = `${environment.apiUrl}/users`;

  constructor(private httpClient: HttpClient) { }

  getUser(userId: number): Observable<User>{
    return this.httpClient.get<User>(`${this.usersUrl}/${userId}`);
  }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.usersUrl);
  }

  searchUsers(keyWord: string) {
    return this.httpClient.get<User[]>(`${this.usersUrl}/by?keyWord=${keyWord}`);
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.usersUrl, user);
  }

  updateUser(userTo: UserTo): Observable<any> {
    return this.httpClient.put<any>(`${this.usersUrl}/${userTo.id}`, userTo);
  }

  deleteUser(userId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.usersUrl}/${userId}`);
  }

  enableUser(userId: number, enabled: boolean): Observable<any> {
    const enabledQueryParam = `?enabled=${enabled}`;
    return this.httpClient.patch<any>(`${this.usersUrl}/${userId}${enabledQueryParam}`, {});
  }

  changeUserPassword(userId: number, password: string): Observable<any> {
    const passwordQueryParam = `?password=${password}`;
    return this.httpClient.patch<any>(`${this.usersUrl}/${userId}/password${passwordQueryParam}`, {});
  }
}