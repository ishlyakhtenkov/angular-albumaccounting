import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/common/user';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading: boolean;

  returnUrl: string;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/albums');
    } else {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
  }

  onLogin(email: string, password: string): void {
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.login(email, password).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get('Authorization-Token');
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(response.body);
          this.router.navigateByUrl(this.returnUrl);
          this.showLoading = false;
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Welcome, ${response.body.name}!`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
          this.showLoading = false;
        }
      )
    );
  }

  loginAsAdmin(): void {
    this.onLogin('admin@gmail.com', 'admin');
  }

  loginAsUser(): void {
    this.onLogin('user@yandex.ru', 'password');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());   
  }
}