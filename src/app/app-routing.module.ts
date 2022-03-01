import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { AuthGuard } from './_guards/auth.guard';

// แยก route ตาม modules
const routes: Routes = [
  {
    path: 'leave',
    component: AppLayoutComponent,
    children: [
      { path: 'profile', component: ProfileComponent ,canActivate:[AuthGuard]}
    ]
  },
  // { path: '', component: HomeComponent},
  { path: '', component: LoginComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
