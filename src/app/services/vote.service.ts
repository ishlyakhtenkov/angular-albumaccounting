import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vote } from '../common/vote';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private baseUrl = '/votingsystem/rest/votes';

  constructor(private httpClient: HttpClient) { }

  registerVote(theRestaurantId: number): Observable<Vote> {
    const restaurantIdParam = `?restaurantId=${theRestaurantId}`;
    return this.httpClient.post<Vote>(`${this.baseUrl}${restaurantIdParam}`, {});
  }
}
