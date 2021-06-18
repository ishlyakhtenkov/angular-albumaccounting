import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from 'src/app/common/restaurant';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css']
})
export class RestaurantListComponent implements OnInit {

  restaurants: Restaurant[];

  searchMode: boolean;

  constructor(private restaurantService: RestaurantService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => {
        this.listRestaurants();
      }
    );
  }

  listRestaurants() {
    // check if search by keyword is active
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
      this.restaurantService.searchRestaurants(theKeyword).subscribe(
        data => {
          this.restaurants = data;
        }
      );
    } else {
      this.restaurantService.getRestaurantList().subscribe(
        data => {
          this.restaurants = data;
        }
      );
    }
  }
}
