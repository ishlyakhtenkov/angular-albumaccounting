import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/common/user';
import { UserTo } from 'src/app/common/user-to';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[];

  userAddFormGroup: FormGroup;

  userEditFormGroup: FormGroup;

  changePasswordFormGroup: FormGroup;

  constructor(private userService: UserService, private notificationService: NotificationService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.listUsers();

    this.makeUserAddFormGroup();
    this.makeUserEditFormGroup();
    this.makeChangePasswordFormGroup();
  }

  listUsers() {
    this.userService.getUserList().subscribe(
      data => {
        this.users = data;
      }
    );
  }

  searchUsers(keyWord: string) {
    keyWord = keyWord.trim();
    if (keyWord.length > 0) {
      this.userService.searchUsers(keyWord).subscribe(
        data => {
          this.users = data;
        }
      );
    } else {
      this.listUsers();
    }
  }

  // Getters for User Add FormGroup values
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

  // Getters for User Edit FormGroup values
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

  // Getters for Change Password FormGroup values
  get newPassword() {
    return this.changePasswordFormGroup.get('changedPassword.newPassword');
  }
  get repeatNewPassword() {
    return this.changePasswordFormGroup.get('changedPassword.repeatNewPassword');
  }

  makeUserAddFormGroup() {
    this.userAddFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.email]),
        enabled: [true],
        roles: new FormControl([], [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
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
          this.notificationService.sendNotification(NotificationType.SUCCESS, `A new user ${response.email} was created`);
          this.listUsers();
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        }
      );
    }
  }

  makeUserEditFormGroup() {
    this.userEditFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        id: [''],
        nameEdited: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        emailEdited: new FormControl('', [Validators.required, Validators.email]),
        enabledEdited: [true],
        rolesEdited: new FormControl([], [Validators.required])
      })
    });
  }

  editUser(user: User) {
    this.userEditFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        id: [user.id],
        nameEdited: new FormControl(user.name, [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        emailEdited: new FormControl(user.email, [Validators.required, Validators.email]),
        enabledEdited: [user.enabled],
        rolesEdited: new FormControl([user.roles], [Validators.required])
      })
    });
  }

  // Submit User Edit From
  onUpdateUser() {
    if (this.userEditFormGroup.invalid) {
      this.userEditFormGroup.markAllAsTouched();
    } else {
      let updatedUserTo = new UserTo(this.userEditFormGroup.get('user.id').value, this.userEditFormGroup.get('user.nameEdited').value, 
                      this.userEditFormGroup.get('user.emailEdited').value,
                      this.userEditFormGroup.get('user.enabledEdited').value, this.userEditFormGroup.get('user.rolesEdited').value);
      console.log(updatedUserTo);
      this.userService.updateUser(updatedUserTo).subscribe(
        response => {
          document.getElementById("user-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The user ${updatedUserTo.email} was updated`);
          this.listUsers();
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        }
  
      );
    }
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      response => {
        this.notificationService.sendNotification(NotificationType.SUCCESS, `The user with id=${id} was deleted`);
        this.listUsers();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
      }
    );
  }

  makeChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        changePasswordId: [''],
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, {validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword')})
    });
  }

  editPassword(userId: number) {
    document.getElementById("user-edit-modal-close").click();
    this.changePasswordFormGroup = this.formBuilder.group({
      changedPassword: this.formBuilder.group({
        changePasswordId: [userId],
        newPassword: new FormControl('', [Validators.required, Validators.minLength(5), CustomValidators.notOnlyWhitespace]),
        repeatNewPassword: new FormControl('', [Validators.required])
      }, {validator: this.checkIfMatchingPasswords('newPassword', 'repeatNewPassword')})
    });
  }

  onChangePassword() {
    if (this.changePasswordFormGroup.invalid) {
      this.changePasswordFormGroup.markAllAsTouched();
    } else {
      console.log(this.changePasswordFormGroup.get('changedPassword.changePasswordId').value);
      console.log(this.changePasswordFormGroup.get('changedPassword.newPassword').value);
      let userId = this.changePasswordFormGroup.get('changedPassword.changePasswordId').value;
      let newPassword = this.changePasswordFormGroup.get('changedPassword.newPassword').value;
      this.userService.changeUserPassword(userId, newPassword).subscribe(
        response => {
          document.getElementById("change-password-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `Password was updated`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.notificationService.sendNotifications(NotificationType.ERROR, errorResponse.error.details);
        }

      );
    }

  }
}