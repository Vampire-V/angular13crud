import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Auth } from '../_interfaces/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  auth: Auth = {
    email : '',
    verifyCode : ''
  };

  email = new FormControl('pipat.p@haier.co.th', [Validators.required, Validators.email]);
  verifycode = new FormControl('3135', [
    Validators.required,
    Validators.maxLength(4),
    Validators.minLength(4),
  ]);

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: Router
  ) {
    this.tokenStorage.signOut();
  }

  ngOnInit(): void {
    // if (this.tokenStorage.getToken()) {
    //   this.isLoggedIn = true;
    //   this.roles = this.tokenStorage.getUser().roles;
    // }
  }

  onSubmit(): void {
    // const { email, verifycode } = this.authForm.value;
    this.auth.email = this.email.value
    this.auth.verifyCode = this.verifycode.value

    this.authService.login(this.auth).subscribe({
      next: (data) => {
        // console.log(data);

        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveRefreshToken(data.refreshToken);
        this.tokenStorage.saveUser(data.user);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().roles;
        // this.reloadPage();
      },
      error: (err:Error) => {
        // console.error(err.stack);

        // this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
      complete: () => {
        // console.info('login complete..')
        if (this.isLoggedIn) {
          this.route.navigateByUrl('/leave/profile')
        }
      }
    });
    // this.authService
    //   .login(this.login.value)
    //   .subscribe({
    //     next : (num) =>  {
    //       console.log('Next num: ' + num);
    //     },
    //     error : (err) => {
    //       console.error('Received an error: ', err.error.errors);
    //     },
    //   });
  }

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getVerifyError(): string {
    if (this.verifycode.hasError('required')) {
      return 'You must enter a value';
    }

    return this.verifycode.hasError('minlength')
      ? 'Not a valid verifycode'
      : '';
  }

  reloadPage(): void {
    window.location.reload();
  }
}
