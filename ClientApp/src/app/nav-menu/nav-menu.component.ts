import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../login-services';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) { }

  isExpanded = false;
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logout() {
    this.authService.logout();
  }

  get isLogged() {
    return this.authService.isLogged;
  }


}
