import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/common/user';
import { UserTo } from 'src/app/common/user-to';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: User;

  changePasswordFormGroup: FormGroup;

  constructor(private profileService: ProfileService, private authenticationService: AuthenticationService, 
              private notificationService: NotificationService, private location: Location, private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(
      (response: User) => {
        this.profile = response;
      },
      (errorResponse: HttpErrorResponse) => {
        this.authenticationService.logout();
        this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        this.router.navigateByUrl("/login");
      }
    );

    this.makeChangePasswordFormGroup();
  }

    // Getters for Change Password FormGroup values
    get newPassword() {
      return this.changePasswordFormGroup.get('changedPassword.newPassword');
    }
    get repeatNewPassword() {
      return this.changePasswordFormGroup.get('changedPassword.repeatNewPassword');
    }
  

  updateProfile(theUserTo: UserTo): void {
    // if (+this.user.id == 100000 || +this.user.id == 100001) {
    //   this.notificationService.sendNotification(NotificationType.ERROR, `Test profile cannot be updated!`);
    // } else {
    //   // let userTo = new UserTo(this.user.id, theUserTo.name, theUserTo.email, theUserTo.password);
    // // this.userService.updateUser(userTo).subscribe(
    //   response => {
    //     this.notificationService.sendNotification(NotificationType.SUCCESS, `The profile was updated`);
    //     // const authData = window.btoa(theUserTo.email + ':' + theUserTo.password);
    //     // this.authenticationService.saveToken(authData);
    //   },
    //   (errorResponse: HttpErrorResponse) => {
    //     this.handleErrorResponse(errorResponse);
    //   }
    // )
    // }
  }

  logOut(): void {
    this.authenticationService.logout();
    this.notificationService.sendNotification(NotificationType.SUCCESS, 'You have been logged out');
    this.router.navigateByUrl("/albums");
  }

  makeChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, {validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword')})
    });
  }

  editPassword() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, {validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword')})
    });
  }

  private checkIfMatchingPasswords(passwordKey: string, repeatPasswordKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let repeatPasswordInput = group.controls[repeatPasswordKey];
      if (!repeatPasswordInput.value) {
        return repeatPasswordInput.setErrors({required: true});
      }
      if (passwordInput.value !== repeatPasswordInput.value) {
        return repeatPasswordInput.setErrors({notEquivalent: true});
      }
      else {
          return repeatPasswordInput.setErrors(null);
      }
    }
  }

  onChangePassword(): void {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
    } else {
      if (+this.profile.id == 100000 || +this.profile.id == 100001) {
        this.notificationService.sendNotification(NotificationType.ERROR, `Test profile password cannot be changed!`);
      } else {
        let newPassword = this.changePasswordFormGroup.get('changedPassword.newPassword').value;
        this.profileService.changePassword(newPassword).subscribe(
          response => {
            document.getElementById("change-password-modal-close").click();
            this.notificationService.sendNotification(NotificationType.SUCCESS, `Password has been changed`);
          },
          (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          }
        );
      }
    }
  }


  back(): void {
    this.location.back()
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
