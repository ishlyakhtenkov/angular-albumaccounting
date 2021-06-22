import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from 'src/app/common/restaurant';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.css']
})
export class RestaurantFormComponent implements OnInit {

  restaurant: Restaurant;

  restaurantFormGroup: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, 
              private restaurantService: RestaurantService, private notificationService: NotificationService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      () => {
        this.handleRestaurantDetails();
      }
    );

    this.restaurantFormGroup = this.formBuilder.group({
      restaurant: this.formBuilder.group({
        name: new FormControl(this.restaurant.name, [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        address: new FormControl(this.restaurant.address, [Validators.required, Validators.minLength(10), CustomValidators.notOnlyWhitespace])
      })
    });
  }

  handleRestaurantDetails() {
    let imageUrl = this.route.snapshot.queryParamMap.has('imageUrl') ? this.route.snapshot.queryParamMap.get('imageUrl') : this.getRandomImageUrl();
    console.log(imageUrl);
    this.restaurant = new Restaurant(this.route.snapshot.queryParamMap.get('id'), this.route.snapshot.queryParamMap.get('name'), 
                                     this.route.snapshot.queryParamMap.get('address'), imageUrl);
  }

  // getters for FormGroup values
  get name() {
    return this.restaurantFormGroup.get('restaurant.name');
  }
  get address() {
    return this.restaurantFormGroup.get('restaurant.address');
  }

  onSubmit() {
    if (this.restaurantFormGroup.invalid) {
      this.restaurantFormGroup.markAllAsTouched();
    } else {
      let theRestaurant = new Restaurant(this.restaurant.id, this.restaurantFormGroup.get('restaurant.name').value, 
                                         this.restaurantFormGroup.get('restaurant.address').value, this.restaurant.imageUrl);
      if (this.restaurant.id == null) {
        this.restaurantService.createRestaurant(theRestaurant).subscribe(
          (response: Restaurant) => {
            this.notificationService.sendNotification(NotificationType.SUCCESS, `A new restaurant ${response.name} was created`);
            this.router.navigate([`/restaurants/${response.id}`], 
                                  {queryParams: {id: response.id, name: response.name, address: response.address, imageUrl: response.imageUrl}});
          },
          (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          }
        );
      } else {
        this.restaurantService.updateRestaurant(theRestaurant).subscribe(
          response => {
            this.notificationService.sendNotification(NotificationType.SUCCESS, `The restaurant was updated`);
            this.router.navigate([`/restaurants/${theRestaurant.id}`], 
                                  {queryParams: {id: theRestaurant.id, name: theRestaurant.name, address: theRestaurant.address, imageUrl: theRestaurant.imageUrl}});
          },
          (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          }
        );
      }
    }
  }

  // generate random image url for restaurant
  private getRandomImageUrl(): string {
    const randomNumber = Math.round(Math.random() * 9);
    return `assets/images/default-restaurant-image-${randomNumber}.jpg`;
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse): void {
    if (errorResponse.status == 401) {
      this.authenticationService.logout();
      this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
      this.router.navigateByUrl("/login");
    } else {
      this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
    }
  }
}