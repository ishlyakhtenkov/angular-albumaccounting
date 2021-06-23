import { HttpClient} from '@angular/common/http';
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

  getUser(id: number): Observable<User>{
    return this.httpClient.get<User>(`${this.usersUrl}/${id}`);
  }

  getUserList(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.usersUrl);
  }

  searchUsers(keyWord: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.usersUrl}/by?keyWord=${keyWord}`);
  }

  createUser(user: User): Observable<User> {
    return this.httpClient.post<User>(this.usersUrl, user);
  }

  updateUser(userTo: UserTo): Observable<any> {
    return this.httpClient.put<any>(`${this.usersUrl}/${userTo.id}`, userTo);
  }

  deleteUser(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.usersUrl}/${id}`);
  }

  enableUser(id: number, enabled: boolean): Observable<any> {
    const enabledQueryParam = `?enabled=${enabled}`;
    return this.httpClient.patch<any>(`${this.usersUrl}/${id}${enabledQueryParam}`, {});
  }

  changeUserPassword(id: number, newPassword: string): Observable<any> {
    const passwordQueryParam = `?password=${newPassword}`;
    return this.httpClient.patch<any>(`${this.usersUrl}/${id}/password${passwordQueryParam}`, {});
  }
}