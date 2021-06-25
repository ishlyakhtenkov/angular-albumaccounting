import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { UserTo } from 'src/app/common/user-to';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[];

  userAddFormGroup: FormGroup;

  userEditFormGroup: FormGroup;

  changePasswordFormGroup: FormGroup;

  refreshing: boolean;

  constructor(private userService: UserService, private notificationService: NotificationService, 
              private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.listUsers();
    this.makeUserAddFormGroup();
    this.makeUserEditFormGroup();
    this.makeChangePasswordFormGroup();
  }

  listUsers() {
    this.refreshing = true;
    this.userService.getUserList().subscribe(
      (response: User[]) => {
        this.users = response;
        this.refreshing = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
        this.refreshing = false;
      }
    );
  }

  searchUsers(keyWord: string) {
    this.refreshing = true;
    keyWord = keyWord.trim();
    if (keyWord.length > 0) {
      this.userService.searchUsers(keyWord).subscribe(
        (response: User[]) => {
          this.users = response;
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
          this.refreshing = false;
        }
      );
    } else {
      this.listUsers();
    }
  }

  // Getters for userAddFormGroup values
  get name() {
    return this.userAddFormGroup.get('user.name');
  }
  get email() {
    return this.userAddFormGroup.get('user.email');
  }
  get enabled() {
    return this.userAddFormGroup.get('user.enabled');
  }
  get roles() {
    return this.userAddFormGroup.get('user.roles');
  }
  get password() {
    return this.userAddFormGroup.get('user.password');
  }
  get repeatPassword() {
    return this.userAddFormGroup.get('user.repeatPassword');
  }

  // Getters for userEditFormGroup values
  get id() {
    return this.userEditFormGroup.get('user.id');
  }
  get nameEdited() {
    return this.userEditFormGroup.get('user.nameEdited');
  }
  get emailEdited() {
    return this.userEditFormGroup.get('user.emailEdited');
  }
  get enabledEdited() {
    return this.userEditFormGroup.get('user.enabledEdited');
  }
  get rolesEdited() {
    return this.userEditFormGroup.get('user.rolesEdited');
  }

  // Getters for changePasswordFormGroup values
  get newPassword() {
    return this.changePasswordFormGroup.get('changedPassword.newPassword');
  }
  get repeatNewPassword() {
    return this.changePasswordFormGroup.get('changedPassword.repeatNewPassword');
  }

  makeUserAddFormGroup() {
    this.userAddFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        enabled: [true],
        roles: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatPassword: new FormControl('', [Validators.required])
      }, {validator: this.checkIfMatchingPasswords('password', 'repeatPassword')})
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

  // Submit Add User From
  onAddNewUser() {
    if (this.userAddFormGroup.invalid) {
      this.userAddFormGroup.markAllAsTouched();
    } else {
      let newUser = new User(null, this.userAddFormGroup.get('user.name').value, 
                      this.userAddFormGroup.get('user.email').value, this.userAddFormGroup.get('user.password').value,
                      this.userAddFormGroup.get('user.enabled').value, this.userAddFormGroup.get('user.roles').value);
      this.userService.createUser(newUser).subscribe(
        (response: User) => {
          document.getElementById("user-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `A new user '${response.name}' was created`);
          this.listUsers();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("user-add-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  private makeUserEditFormGroup() {
    this.userEditFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        id: [''],
        nameEdited: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        emailEdited: new FormControl('', [Validators.required, Validators.maxLength(40), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        enabledEdited: [true],
        rolesEdited: new FormControl('', [Validators.required])
      })
    });
  }

  prepareUserEditFormGroup(user: User) {
    this.userEditFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        id: [user.id],
        nameEdited: new FormControl(user.name, [Validators.required, Validators.minLength(4), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        emailEdited: new FormControl(user.email, [Validators.required, Validators.maxLength(40), Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        enabledEdited: [user.enabled],
        rolesEdited: new FormControl(user.roles, [Validators.required])
      })
    });
  }

  // Submit User Edit From
  onUpdateUser() {
    if (this.userEditFormGroup.invalid) {
      this.userEditFormGroup.markAllAsTouched();
    } else {
      let id = this.userEditFormGroup.get('user.id').value;
      if (id == 100000 || id == 100001) {
        this.notificationService.sendNotification(NotificationType.ERROR, `Test user cannot be updated!`);
      } else {
        let updatedUserTo = new UserTo(this.userEditFormGroup.get('user.id').value, 
                                       this.userEditFormGroup.get('user.nameEdited').value, 
                                       this.userEditFormGroup.get('user.emailEdited').value,
                                       this.userEditFormGroup.get('user.enabledEdited').value, 
                                       this.userEditFormGroup.get('user.rolesEdited').value);
      this.userService.updateUser(updatedUserTo).subscribe(
        response => {
          document.getElementById("user-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The user '${updatedUserTo.name}' was updated`);
          this.listUsers();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("user-edit-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
      }
    }
  }

  deleteUser(id: number, name: string) {
    if (confirm(`Are you sure want to delete user '${name}'?`)) {
      if (id == 100000 || id == 100001) {
        this.notificationService.sendNotification(NotificationType.ERROR, `Test user cannot be deleted!`);
      } else {
        this.userService.deleteUser(id).subscribe(
          response => {
            this.notificationService.sendNotification(NotificationType.SUCCESS, `The user '${name}' was deleted`);
            this.listUsers();
          },
          (errorResponse: HttpErrorResponse) => {
            this.handleErrorResponse(errorResponse);
          }
        );  
      }
    }
  }

  private makeChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        changePasswordId: [''],
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, {validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword')})
    });
  }

  prepareChangePasswordFormGroup(userId: number) {
    document.getElementById("user-edit-modal-close").click();
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        changePasswordId: [userId],
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, {validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword')})
    });
  }

  onChangePassword() {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
    } else {
      let userId = this.changePasswordFormGroup.get('changedPassword.changePasswordId').value;
      if (+userId == 100000 || +userId == 100001) {
        this.notificationService.sendNotification(NotificationType.ERROR, `Test user password cannot be changed!`);
      } else {
        let newPassword = this.changePasswordFormGroup.get('changedPassword.newPassword').value;
        this.userService.changeUserPassword(userId, newPassword).subscribe(
          response => {
            document.getElementById("change-password-modal-close").click();
            this.notificationService.sendNotification(NotificationType.SUCCESS, `Password for ${this.nameEdited.value} was updated`);
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status == 401 || errorResponse.status == 403) {
              document.getElementById("change-password-modal-close").click();
            }
            this.handleErrorResponse(errorResponse);
          }
        );  
      }
    }
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse): void {
    if (errorResponse.status == 401 || errorResponse.status == 403) {
      this.authenticationService.logout();
      this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
      this.router.navigateByUrl("/login");
    } else {
      this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
    }
  }
}