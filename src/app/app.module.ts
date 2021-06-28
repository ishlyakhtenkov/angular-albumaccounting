import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthenticationGuard } from './guards/authentication.guard';
import { NotificationModule } from './notification.module';
import { NotificationService } from './services/notification.service';
import { LoginComponent } from './components/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminGuard } from './guards/admin.guard';
import { ProfileService } from './services/profile.service';
import { DepartmentService } from './services/department.service';
import { DepartmentComponent } from './components/department/department.component';
import { UserComponent } from './components/user/user.component';
import { EmployeeService } from './services/employee.service';
import { EmployeeComponent } from './components/employee/employee.component';
import { AlbumService } from './services/album.service';
import { AlbumComponent } from './components/album/album.component';
import { ErrorHandlingService } from './services/error-handling.service';
import { TestDataCheckingService } from './services/test-data-checking.service';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'departments', component: DepartmentComponent, canActivate: [AdminGuard]},
  {path: 'employees', component: EmployeeComponent, canActivate: [AuthenticationGuard]},
  {path: 'albums', component: AlbumComponent},
  {path: 'users', component: UserComponent, canActivate: [AdminGuard]},
  {path: '', redirectTo: '/albums', pathMatch: 'full'},
  {path: '**', redirectTo: '/albums', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    ProfileComponent,
    DepartmentComponent,
    AlbumComponent,
    UserComponent,
    EmployeeComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NotificationModule,
    NgbModule,
    FormsModule
  ],
  providers: [AuthenticationService, UserService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, 
    AuthenticationGuard, AdminGuard, NotificationService, ProfileService, DepartmentService, EmployeeService, AlbumService,
    ErrorHandlingService, TestDataCheckingService],
  bootstrap: [AppComponent]
})
export class AppModule { }