import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Restaurant } from '../common/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  
  private baseUrl = '/votingsystem/rest/restaurants';

  voteButtonStatus: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient) { }

  getRestaurant(theRestaurantId: number): Observable<Restaurant> {
    const restaurantUrl = `${this.baseUrl}/${theRestaurantId}`;
    return this.httpClient.get<Restaurant>(restaurantUrl);
  }

  getRestaurantList(): Observable<Restaurant[]> {
    return this.httpClient.get<Restaurant[]>(this.baseUrl);
  }

  searchRestaurants(theKeyword: string): Observable<Restaurant[]> {
    return this.httpClient.get<Restaurant[]>(`${this.baseUrl}/by?name=${theKeyword}`);
  }

  createRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.httpClient.post<Restaurant>(this.baseUrl, restaurant);
  }

  deleteRestaurant(theRestaurantId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${theRestaurantId}`);
  }

  updateRestaurant(restaurant: Restaurant): Observable<any> {
    console.log(restaurant);
    console.log(`${this.baseUrl}/${restaurant.id}`);
    return this.httpClient.put<any>(`${this.baseUrl}/${restaurant.id}`, restaurant);
  }

  // tell subscribers show/not show 'Vote' button
  showVoteButton(enabled: boolean) {
    this.voteButtonStatus.next(enabled);
  }
}