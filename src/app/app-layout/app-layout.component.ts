import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Menu } from '../_interfaces/menu';
import { TokenStorageService } from '../_services/token-storage.service';
import { EventBusService } from '../_shared/event-bus.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
})
export class AppLayoutComponent implements OnInit {
  title = 'authentication';
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;

  eventBusSub?: Subscription;
  isExpanded: boolean = true;
  menus: Menu[] = [
    // {
    //   uri: '',
    //   icon: 'home',
    //   name: 'Home',
    // },
    {
      uri: 'profile',
      icon: 'account_circle',
      name: 'Leave',
    },
    // {
    //   uri: 'error',
    //   icon: 'running_with_errors',
    //   name: 'Error page',
    // },
    {
      uri: '',
      icon: 'running_with_errors',
      name: 'Logout',
    },
  ];

  constructor(
    private tokenStorageService: TokenStorageService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      // this.roles = user.roles;

      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      // this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }
  ngOnDestroy(): void {
    if (this.eventBusSub) this.eventBusSub.unsubscribe();
  }

  logout(): void {
    this.tokenStorageService.signOut();

    this.isLoggedIn = false;
    this.roles = [];
    this.showAdminBoard = false;
    this.showModeratorBoard = false;
  }
}
