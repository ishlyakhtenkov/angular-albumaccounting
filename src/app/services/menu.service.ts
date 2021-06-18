import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../common/menu';
import { MenuTo } from '../common/menu-to';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = '/votingsystem/rest/restaurants';

  constructor(private httpClient: HttpClient) { }

  getMenuToday(theRestaurantId: number): Observable<Menu> {
    const menuTodayUrl = `${this.baseUrl}/${theRestaurantId}/menus/today`;
    return this.httpClient.get<Menu>(menuTodayUrl);
  }

  createMenuToday(theRestaurantId: number, menuTo: MenuTo): Observable<Menu> {
    const menuTodayUrl = `${this.baseUrl}/${theRestaurantId}/menus/today`;
    return this.httpClient.post<Menu>(menuTodayUrl, menuTo);
  }

  updateMenuToday(theRestaurantId: number, menuTo: MenuTo): Observable<any> {
    const menuTodayUrl = `${this.baseUrl}/${theRestaurantId}/menus/today`;
    return this.httpClient.put<any>(menuTodayUrl, menuTo);
  }

  deleteMenuToday(theRestaurantId: number): Observable<any> {
    const menuTodayUrl = `${this.baseUrl}/${theRestaurantId}/menus/today`;
    return this.httpClient.delete<any>(menuTodayUrl);
  }
}
