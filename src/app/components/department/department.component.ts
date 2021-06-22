import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from 'src/app/common/department';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  departments: Department[];

  departmentAddFormGroup: FormGroup;

  departmentEditFormGroup: FormGroup;

  constructor(private departmentService: DepartmentService, private notificationService: NotificationService, 
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.listDepartments();
    this.makeDepartmentAddFormGroup();
    this.makeDepartmentEditFormGroup();
  }

  listDepartments() {
    this.departmentService.getDepartmentList().subscribe(
      (response: Department[]) => {
        this.departments = response;
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  makeDepartmentAddFormGroup() {
    this.departmentAddFormGroup = this.formBuilder.group({
      department: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
      })
    });
  }

  private makeDepartmentEditFormGroup() {
    this.departmentEditFormGroup = this.formBuilder.group({
      department: this.formBuilder.group({
        id: [''],
        nameEdited: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace])
      })
    });
  }

  // Getters for departmentAddFormGroup values
  get name() {
    return this.departmentAddFormGroup.get('department.name');
  }

  // Getters for departmentEditFormGroup values
  get id() {
    return this.departmentEditFormGroup.get('department.id');
  }
  get nameEdited() {
    return this.departmentEditFormGroup.get('department.nameEdited');
  }

  // Submit Add User From
  onAddNewDepartment() {
    if (this.departmentAddFormGroup.invalid) {
      this.departmentAddFormGroup.markAllAsTouched();
    } else {
      let newDepartment = new Department(null, this.departmentAddFormGroup.get('department.name').value);
      this.departmentService.createDepartment(newDepartment).subscribe(
        (response: Department) => {
          document.getElementById("department-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `A new department '${response.name}' was created`);
          this.listDepartments();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("department-add-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  editDepartment(department: Department) {
    this.departmentEditFormGroup = this.formBuilder.group({
      department: this.formBuilder.group({
        id: [department.id],
        nameEdited: new FormControl(department.name, [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace])
      })
    });
  }

  // Submit Department Edit From
  onUpdateDepartment() {
    if (this.departmentEditFormGroup.invalid) {
      this.departmentEditFormGroup.markAllAsTouched();
    } else {
      let updatedDepartment = new Department(this.id.value, this.nameEdited.value);
      this.departmentService.updateDepartment(updatedDepartment).subscribe(
        response => {
          document.getElementById("department-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The department '${updatedDepartment.name}' was updated`);
          this.listDepartments();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("department-edit-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  deleteDepartment(id: number, name: string) {
    if (confirm(`Are you sure want to delete department '${name}'?`)) {
      this.departmentService.deleteDepartment(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The department '${name}' was deleted`);
          this.listDepartments();
        },
        (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        }
      );
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