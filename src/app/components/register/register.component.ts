import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/common/user';
import { UserTo } from 'src/app/common/user-to';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  showLoading: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/restaurants');
    }
  }

  onRegister(registerTo: UserTo): void {
    let userTo = new UserTo(registerTo.id, registerTo.name, registerTo.email, registerTo.password);
    this.showLoading = true;
    // this.subscriptions.push(
    //   this.authenticationService.register(userTo).subscribe(
    //     (response: User) => {
    //       this.showLoading = false;
    //       this.notificationService.sendNotification(NotificationType.SUCCESS, `A new account was created for ${response.email}`);
    //       this.router.navigateByUrl("/login");
    //     },
    //     (errorResponse: HttpErrorResponse) => {
    //       this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
    //       this.showLoading = false;
    //     }
    //   )
    // );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());   
  }
}
