import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from 'src/app/common/department';
import { Employee } from 'src/app/common/employee';
import { EmployeeTo } from 'src/app/common/employee-to';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  departments: Department[] = [];

  selectedDepartment: Department = null;

  employees: Employee[];

  employeeAddFormGroup: FormGroup;

  employeeEditFormGroup: FormGroup;

  refreshing: boolean;

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService, private notificationService: NotificationService, 
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.listDepartments();
    this.makeEmployeeAddFormGroup();
    this.makeEmployeeEditFormGroup();
  }

  listEmployees() {
    this.refreshing = true;
    this.employeeService.getEmployeeList(+this.selectedDepartment.id).subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.refreshing = false;
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.status == 422) {
          this.listDepartments();
        }
        this.handleErrorResponse(errorResponse);
        this.refreshing = false;
      }
    );
  }

  listDepartments() {
    this.refreshing = true;
    this.departmentService.getDepartmentList().subscribe(
      (response: Department[]) => {
        this.departments = response;
        if (this.selectedDepartment == null) {
          this.selectedDepartment = this.departments[0];
        } else {
          let selectedDepartmentIndex = this.departments.findIndex(tempDepartment => tempDepartment.name === this.selectedDepartment.name);
          if (selectedDepartmentIndex != -1) {
            this.selectedDepartment = this.departments[selectedDepartmentIndex];
          } else {
            this.selectedDepartment = this.departments[0];
          }
        }
        this.listEmployees();
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  makeEmployeeAddFormGroup() {
    this.employeeAddFormGroup = this.formBuilder.group({
      employee: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        phoneNumber: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        department: new FormControl(this.selectedDepartment, [Validators.required])
      })
    });
  }

  private makeEmployeeEditFormGroup() {
    this.employeeEditFormGroup = this.formBuilder.group({
      employee: this.formBuilder.group({
        id: [''],
        nameEdited: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        phoneNumberEdited: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        departmentEdited: new FormControl('', [Validators.required])
      })
    });
  }

  // Getters for employeeAddFormGroup values
  get name() {
    return this.employeeAddFormGroup.get('employee.name');
  }
  get phoneNumber() {
    return this.employeeAddFormGroup.get('employee.phoneNumber');
  }
  get department() {
    return this.employeeAddFormGroup.get('employee.department');
  }

  // Getters for employeeEditFormGroup values
  get id() {
    return this.employeeEditFormGroup.get('employee.id');
  }
  get nameEdited() {
    return this.employeeEditFormGroup.get('employee.nameEdited');
  }
  get phoneNumberEdited() {
    return this.employeeEditFormGroup.get('employee.phoneNumberEdited');
  }
  get departmentEdited() {
    return this.employeeEditFormGroup.get('employee.departmentEdited');
  }

  // Submit Add Employee From
  onAddNewEmployee() {
    if (this.employeeAddFormGroup.invalid) {
      this.employeeAddFormGroup.markAllAsTouched();
    } else {
      let newEmployeeTo = new EmployeeTo(null, this.name.value, this.phoneNumber.value, this.department.value.id);
      this.employeeService.createEmployee(newEmployeeTo).subscribe(
        (response: Employee) => {
          this.selectedDepartment = this.department.value;
          document.getElementById("employee-add-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `A new employee '${response.name}' was created`);
          this.listEmployees();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("employee-add-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  prepareEmployeeEditFormGroup(employee: Employee) {
    this.employeeEditFormGroup = this.formBuilder.group({
      employee: this.formBuilder.group({
        id: [employee.id],
        nameEdited: new FormControl(employee.name, [Validators.required, Validators.minLength(4), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        phoneNumberEdited: new FormControl(employee.phoneNumber, [Validators.required, Validators.minLength(7), Validators.maxLength(20), CustomValidators.notOnlyWhitespace]),
        departmentEdited: new FormControl(this.selectedDepartment, [Validators.required])
      })
    });
  }

  onUpdateEmployee() {
    if (this.employeeEditFormGroup.invalid) {
      this.employeeEditFormGroup.markAllAsTouched();
    } else {
      let updatedEmployeeTo = new EmployeeTo(this.id.value, this.nameEdited.value, this.phoneNumberEdited.value, this.departmentEdited.value.id);
      this.employeeService.updateEmployee(updatedEmployeeTo).subscribe(
        response => {
          this.selectedDepartment = this.departmentEdited.value;
          document.getElementById("employee-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The employee '${updatedEmployeeTo.name}' was updated`);
          this.listEmployees();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("employee-edit-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  deleteEmployee(id: number, name: string) {
    if (confirm(`Are you sure want to delete employee '${name}'?`)) {
      this.employeeService.deleteEmployee(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The employee '${name}' was deleted`);
          this.listEmployees();
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