import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/common/user';
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

  constructor(private userService: UserService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.listUsers();

    this.makeUserAddFormGroup();
  }

  listUsers() {
    this.userService.getUserList().subscribe(
      data => {
        this.users = data;
      }
    );
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

  makeUserAddFormGroup() {
    this.userAddFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.email]),
        enabled: [true],
        roles: new FormControl([], [Validators.required])
      })
    });
  }

  // Submit Add User From
  onSubmit() {
    if (this.userAddFormGroup.invalid) {
      this.userAddFormGroup.markAllAsTouched();
    } else {
        console.log(this.userAddFormGroup.get('user.name').value);
        console.log(this.userAddFormGroup.get('user.email').value);
        console.log(this.userAddFormGroup.get('user.enabled').value);
        console.log(this.userAddFormGroup.get('user.roles').value);
              // Close Modal Dish Form after pushing 'Save' button
      document.getElementById("user-add-modal-close").click();

      }
    }
  

}