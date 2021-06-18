import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-votingsystem';

  showHeader: boolean = false;
  showSearch: boolean = false;

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'].startsWith('/login') || event['url'] == '/register' || event['url'] == '/profile') {
          this.showHeader = true;
          this.showSearch = false;
        } else {
          this.showHeader = true;
          this.showSearch = true;
        }
      }
    });
  }
}
