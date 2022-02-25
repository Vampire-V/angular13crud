import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  content?: any;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next:(data) => {
        this.content = data.item;
      },
      error:(err) => {

        this.content = err.statusText
        // JSON.parse(err.error).message;
      }
    }
    );
  }
}
