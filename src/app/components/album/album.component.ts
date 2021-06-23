import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Album } from 'src/app/common/album';
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

  //properties for pagination
  pageNumber: number = 1;
  pageSize: number = 1;
  totalElements: number = 0;

  constructor(private albumService: AlbumService, private employeeService: EmployeeService, private departmentService: DepartmentService, private notificationService: NotificationService, 
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.listAlbums();
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

  searchAlbums(keyWord: string) {
    keyWord = keyWord.trim();
    if (keyWord.length > 0) {
      this.albumService.searchAlbumsPaginate(keyWord, this.pageNumber - 1, this.pageSize).subscribe(
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

  makeAlbumAddFormGroup() {

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