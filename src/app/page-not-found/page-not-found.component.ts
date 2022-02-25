import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private userService: UserService) {}
  content:any
  ngOnInit(): void {
    this.userService.getUserNoAuth().subscribe({
      next: (res) => {
        console.log(res);
        this.content = res
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
