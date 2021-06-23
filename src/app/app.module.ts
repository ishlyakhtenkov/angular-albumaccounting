import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestaurantService } from './services/restaurant.service';

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
import { MenuService } from './services/menu.service';
import { VoteService } from './services/vote.service';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { RegisterComponent } from './components/register/register.component';
import { RestaurantDetailsComponent } from './components/restaurant-details/restaurant-details.component';
import { MenuTodayComponent } from './components/menu-today/menu-today.component';
import { SearchComponent } from './components/search/search.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminGuard } from './guards/admin.guard';
import { ProfileService } from './services/profile.service';
import { DepartmentService } from './services/department.service';
import { DepartmentComponent } from './components/department/department.component';
import { AlbumComponent } from './components/album/album.component';
import { UserComponent } from './components/user/user.component';
import { EmployeeService } from './services/employee.service';
import { EmployeeComponent } from './components/employee/employee.component';
import { AlbumService } from './services/album.service';

const routes: Routes = [
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'restaurant-form', component: RestaurantFormComponent, canActivate: [AuthenticationGuard]},
  {path: 'restaurants/:id', component: RestaurantDetailsComponent},
  {path: 'search/:keyword', component: RestaurantListComponent},
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
    RestaurantListComponent,
    SearchComponent,
    RestaurantDetailsComponent,
    MenuTodayComponent,
    RestaurantFormComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
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
  providers: [RestaurantService, AuthenticationService, UserService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}, 
    AuthenticationGuard, AdminGuard, NotificationService, MenuService, VoteService, ProfileService, DepartmentService, EmployeeService, AlbumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
