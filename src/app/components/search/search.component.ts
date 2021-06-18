import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  showAddRestaurantButton: boolean = true;

  constructor(private router: Router, private restaurantService: RestaurantService, private authenticationService: AuthenticationService) { 
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'].includes('/restaurant-form')) {
          this.showAddRestaurantButton = false;
        } else {
          this.showAddRestaurantButton = true;
        }
      }
    });
   }

  ngOnInit(): void {
  }

  doSearch(value: string) {
    this.router.navigateByUrl(`/search/${value}`);
  }
  
  isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }
}
