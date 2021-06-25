import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Album } from 'src/app/common/album';
import { AlbumTo } from 'src/app/common/album-to';
import { Department } from 'src/app/common/department';
import { Employee } from 'src/app/common/employee';
import { EmployeeTo } from 'src/app/common/employee-to';
import { NotificationType } from 'src/app/enums/notification-type.enum';
import { AlbumService } from 'src/app/services/album.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  albums: Album[];

  albumAddFormGroup: FormGroup;
  albumEditFormGroup: FormGroup;
  departments: Department[] = [];
  employees: Employee[] = [];
  editedAlbum: Album;

  searchByDecimalModeActivated: boolean = false;
  decimalNumberSearch: string = null;

  //properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(private albumService: AlbumService, private employeeService: EmployeeService, private departmentService: DepartmentService, private notificationService: NotificationService, 
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.listAlbums();
    if (this.isLoggedIn()) {
      this.makeAlbumAddFormGroup();
      this.makeAlbumEditFormGroup();  
    }
  }

  searchAlbumsByDecimal(decimalNumberSearch: string) {
    this.searchByDecimalModeActivated = true;
    this.pageNumber = 1;
    this.decimalNumberSearch = decimalNumberSearch.trim();
    this.listAlbumsByDecimalNumber();
  }

  listAlbums() {
    this.albumService.getAlbumListPaginate(this.pageNumber - 1, this.pageSize).subscribe(
      response => {
        this.albums = response.content;
        this.pageNumber = response.pageable.page + 1;
        this.pageSize = response.pageable.size;
        this.totalElements = response.total;
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  listAlbumsByDecimalNumber() {
    if (this.decimalNumberSearch.length > 0) {
      this.albumService.searchAlbumsByDecimalPaginate(this.decimalNumberSearch, this.pageNumber - 1, this.pageSize).subscribe(
        response => {
          this.albums = response.content;
          this.pageNumber = response.pageable.page + 1;
          this.pageSize = response.pageable.size;
          this.totalElements = response.total;  
        },
        (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        }
      );
    } else {
      this.listAlbums();
    }
  }

  getAlbumsPage() {
    if (this.searchByDecimalModeActivated) {
      this.listAlbumsByDecimalNumber();
    } else {
      this.listAlbums();
    }
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.getAlbumsPage();
  }

  makeAlbumAddFormGroup() {
    this.employees=null;
    this.getDepartments();
    this.albumAddFormGroup = this.formBuilder.group({
      album: this.formBuilder.group({
        decimalNumber: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        stamp: new FormControl('', [Validators.required]),
        department: new FormControl('', [Validators.required]),
        holder: new FormControl('', [Validators.required])
      })
    });
  }

  private makeAlbumEditFormGroup() {
    this.albumEditFormGroup = this.formBuilder.group({
      album: this.formBuilder.group({
        id: [''],
        decimalNumberEdited: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
        stampEdited: new FormControl('', [Validators.required]),
        departmentEdited: new FormControl('', [Validators.required]),
        holderEdited: new FormControl('', [Validators.required])
      })
    });
  }

  private getDepartments() {
    this.departmentService.getDepartmentList().subscribe(
      (response: Department[]) => {
        this.departments = response;
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  getEmployees(formGroupName: string) {
    const isAlbumAddFormGroup: boolean = (formGroupName == 'albumAddFormGroup');
    let departmentId: number = (isAlbumAddFormGroup) ? this.department.value.id : this.departmentEdited.value.id;

    this.employeeService.getEmployeeList(departmentId).subscribe(
      (response: Employee[]) => {
        this.employees = response;
        if (isAlbumAddFormGroup) {
          this.holder.setValue(this.employees[0]);
        } else {
          this.holderEdited.setValue(this.employees[0]);
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  // Getters for albumAddFormGroup values
  get decimalNumber() {
    return this.albumAddFormGroup.get('album.decimalNumber');
  }
  get stamp() {
    return this.albumAddFormGroup.get('album.stamp');
  }
  get department() {
    return this.albumAddFormGroup.get('album.department');
  }
  get holder() {
    return this.albumAddFormGroup.get('album.holder');
  }

  // Getters for albumEditFormGroup values
  get id() {
    return this.albumEditFormGroup.get('album.id');
  }
  get decimalNumberEdited() {
    return this.albumEditFormGroup.get('album.decimalNumberEdited');
  }
  get stampEdited() {
    return this.albumEditFormGroup.get('album.stampEdited');
  }
  get departmentEdited() {
    return this.albumEditFormGroup.get('album.departmentEdited');
  }
  get holderEdited() {
    return this.albumEditFormGroup.get('album.holderEdited');
  }

  // Submit Add Album Form
  onAddNewAlbum() {
    if (this.albumAddFormGroup.invalid) {
      this.albumAddFormGroup.markAllAsTouched();
    } else {
      let newAlbumTo = new AlbumTo(null, this.decimalNumber.value, this.stamp.value, this.holder.value.id);
      this.albumService.createAlbum(newAlbumTo).subscribe(
        (response: Album) => {
          document.getElementById("album-add-modal-close").click();
          this.employees = null;
          this.notificationService.sendNotification(NotificationType.SUCCESS, `A new album '${response.decimalNumber}' was created`);
          this.getAlbumsPage();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("album-add-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  prepareAlbumEditFormGroup(album: Album) {
    let departmentId = album.holder.department.id;
    this.employeeService.getEmployeeList(+departmentId).subscribe(
      (response: Employee[]) => {
        this.employees = response;

        // get indexes of department from departmments array and holder from employees for use this department in FormControl
        let departmentIndex = this.departments.findIndex(tempDepartment => tempDepartment.name === album.holder.department.name);
        let holderIndex = this.employees.findIndex(tempEmployee => tempEmployee.name === album.holder.name);

        this.albumEditFormGroup = this.formBuilder.group({
          album: this.formBuilder.group({
            id: [album.id],
            decimalNumberEdited: new FormControl(album.decimalNumber, [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhitespace]),
            stampEdited: new FormControl(album.stamp, [Validators.required]),
            departmentEdited: new FormControl(this.departments[departmentIndex], [Validators.required]),
            holderEdited: new FormControl(this.employees[holderIndex], [Validators.required])
          })
        });
      },
      (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      }
    );
  }

  // Submit Edit Album Form
  onUpdateAlbum() {
    if (this.albumEditFormGroup.invalid) {
      this.albumEditFormGroup.markAllAsTouched();
    } else {
      let updatedAlbumTo = new AlbumTo(this.id.value, this.decimalNumberEdited.value, this.stampEdited.value, this.holderEdited.value.id);
      this.albumService.updateAlbum(updatedAlbumTo).subscribe(
        response => {
          document.getElementById("album-edit-modal-close").click();
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The album '${updatedAlbumTo.decimalNumber}' was updated`);
          this.getAlbumsPage();
        },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status == 401 || errorResponse.status == 403) {
            document.getElementById("album-edit-modal-close").click();
          }
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  deleteAlbum(id: number, decimalNumber: string) {
    if (confirm(`Are you sure want to delete album '${decimalNumber}'?`)) {
      this.albumService.deleteAlbum(id).subscribe(
        response => {
          this.notificationService.sendNotification(NotificationType.SUCCESS, `The album '${decimalNumber}' was deleted`);
          this.getAlbumsPage();
        },
        (errorResponse: HttpErrorResponse) => {
          this.handleErrorResponse(errorResponse);
        }
      );
    }
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
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