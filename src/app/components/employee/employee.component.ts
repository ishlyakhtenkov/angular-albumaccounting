import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from 'src/app/common/department';
import { Employee } from 'src/app/common/employee';
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

  selectedDepartment: Department;

  employees: Employee[];

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService, private notificationService: NotificationService, 
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.listDepartments();
  }

  listEmployees() {
    this.employeeService.getEmployeeList(+this.selectedDepartment.id).subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  listDepartments() {
    this.departmentService.getDepartmentList().subscribe(
      (response: Department[]) => {
        this.departments = response;
        this.selectedDepartment = this.departments[0];
        this.listEmployees();
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  makeEmployeeAddFormGroup() {

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