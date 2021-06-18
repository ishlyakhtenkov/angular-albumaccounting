import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Dish } from 'src/app/common/dish';
import { Menu } from 'src/app/common/menu';
import { MenuTo } from 'src/app/common/menu-to';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MenuService } from 'src/app/services/menu.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RestaurantService } from 'src/app/services/restaurant.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

// Custom Duplicate Dish Name Validator
export function duplicateDishNameValidator(dishes: Dish[], updatedDishOldName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    let index = dishes.findIndex(tempDish => tempDish.name === control.value);
    if (control.value !== undefined && (index != -1) && control.value !== updatedDishOldName) {
      return { 'duplicateName': true };
    }
    return null;
  };
}

@Component({
  selector: 'app-menu-today',
  templateUrl: './menu-today.component.html',
  styleUrls: ['./menu-today.component.css']
})
export class MenuTodayComponent implements OnInit {

  // Menu from BackEnd
  menu: Menu = new Menu();

  currentDishes: Dish[] = [];

  dishFormGroup: FormGroup;

  // This value defines wich dish (new or existed) comes from modal form (it needs to know add or update dish in currentDishes array)
  isDishNew: boolean = true;

  // This value stores old name of updated dish that comes from modal form (it needs for duplicate dish name validator, and for update dish in currentDishes array)
  updatedDishOldName: string;

  // Inject restaurant data from parent component
  @Input()
  restaurantId: string;
  @Input()
  restaurantName: string;
  // @Input()
  // restaurantAddress: string;
  // @Input()
  // restaurantImageUrl: string;

  constructor(private restaurantService: RestaurantService, private menuService: MenuService, private router: Router, 
              private formBuilder: FormBuilder, private notificationService: NotificationService, private authenticationService: AuthenticationService) {
    
   }

  ngOnInit(): void {
    this.getTodayMenu();

    this.makeDishFormGroup('', 0, true);
  }

  getTodayMenu() {
    this.menuService.getMenuToday(+this.restaurantId).subscribe(
      data => {
        this.menu = data;
        this.sortDishesArray(this.menu.dishes);
        this.currentDishes = Array.from(this.menu.dishes);

        // Tell restaurant service show/not show 'Vote button'
        this.restaurantService.showVoteButton(this.menu.dishes.length > 0);
      }
    );
  }

  publishTodayMenu() {
    if (this.menu.dishes.length == 0) {
      this.createTodayMenu();
    } else if (this.currentDishes.length == 0) {
      this.deleteTodayMenu();
    } else {
      this.updateTodayMenu();
    }
  }

  private createTodayMenu() {
    console.log("MenuTo POST for restaurant: " + this.restaurantId);
      this.menuService.createMenuToday(+this.restaurantId, new MenuTo(this.currentDishes)).subscribe(
        (response: Menu) => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Today's menu for ${this.restaurantName} was created`);
          this.reloadRestaurantComponent();
        },
        (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        }
      );
  }

  private updateTodayMenu() {
    console.log("MenuTo PUT for restaurant: " + this.restaurantId);
      this.menuService.updateMenuToday(+this.restaurantId, new MenuTo(this.currentDishes)).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Today's menu for ${this.restaurantName} was updated`);
          this.reloadRestaurantComponent();
        },
        (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        }
      );
  }

  private deleteTodayMenu() {
    console.log("MenuTo DELETE for restaurant: " + this.restaurantId);
      this.menuService.deleteMenuToday(+this.restaurantId).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Today's menu for ${this.restaurantName} was deleted`);
          this.reloadRestaurantComponent();          
        },
        (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        }
      );
  }

  // Getters for Dish FormGroup values
  get name() {
    return this.dishFormGroup.get('dish.name');
  }
  get price() {
    return this.dishFormGroup.get('dish.price');
  }

  deleteDish(dishName: string) {
    console.log("Delete dish with name: " + dishName);
    let index = this.currentDishes.findIndex(tempDish => tempDish.name === dishName);
    if (index != -1) {
      this.currentDishes.splice(index, 1);
    }
  }

  makeDishFormGroupForUpdate(dishName: string, dishPrice: number) {
    this.updatedDishOldName = dishName;
    this.makeDishFormGroup(dishName, dishPrice, false);
  }

  // Prepare Dish Form Group
  makeDishFormGroup(dishName: string, dishPrice: number, isDishNew: boolean) {
    this.isDishNew = isDishNew;
    this.dishFormGroup = this.formBuilder.group({
      dish: this.formBuilder.group({
        name: new FormControl(dishName, [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace, duplicateDishNameValidator(this.currentDishes, this.updatedDishOldName)]),
        price: new FormControl(dishPrice, [Validators.required, CustomValidators.minOne])
      })
    });
  }

  // Submit Dish From
  onSubmit() {
    if (this.dishFormGroup.invalid) {
      this.dishFormGroup.markAllAsTouched();
    } else {
      let dish: Dish = new Dish();
      dish.name = this.dishFormGroup.get('dish.name').value;
      dish.price = this.dishFormGroup.get('dish.price').value;
      if (this.isDishNew) {
        this.currentDishes.push(dish);
        this.sortDishesArray(this.currentDishes);
      } else {
        this.deleteDish(this.updatedDishOldName);
        this.updatedDishOldName = null;
        this.currentDishes.push(dish);
        this.sortDishesArray(this.currentDishes);
      }

      // Close Modal Dish Form after pushing 'Save' button
      document.getElementById("dish-modal-close").click();
    }
  }

  private sortDishesArray(dishes: Dish[]) {
    dishes.sort((dish1, dish2) => dish1.name.localeCompare(dish2.name));
  }

  private reloadRestaurantComponent() {
    this.router.navigateByUrl('/restaurants', {skipLocationChange: true}).then(() => {
      this.router.navigateByUrl(`/restaurants/${this.restaurantId}`);
      // this.router.navigate([`/restaurants/${this.restaurantId}`], 
      // {queryParams: {id: this.restaurantId, name: this.restaurantName, address: this.restaurantAddress, imageUrl: this.restaurantImageUrl}});
    });
  }

  // Check menu.dishes and currentDishes for equality
  isDishArraysEqual(): boolean {
    return JSON.stringify(this.currentDishes) === JSON.stringify(this.menu.dishes);
  }

  isAdmin(): boolean {
    return this.authenticationService.isAdmin();
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
