import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
  }

  isUserLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authenticationService.isAdmin();
  }

  routeToLogin(): void {
    console.log(this.router.url);
    this.router.navigate([`/login`], 
              {queryParams: {returnUrl: this.router.url}});
  }
}