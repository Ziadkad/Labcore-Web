import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./Features/Auth/pages/login-page/login-page.component";
import {RegisterPageComponent} from "./Features/Auth/pages/register-page/register-page.component";
import {VerifyEmailPageComponent} from "./Features/Auth/pages/verify-email-page/verify-email-page.component";
import {emailVerifiedGuard} from "./Core/Guards/email-verified-guard/email-verified.guard";
import {authGuard} from "./Core/Guards/auth-guard/auth.guard";
import {guestGuard} from "./Core/Guards/guest-guard/guest.guard";
import {emailNotVerifiedGuard} from "./Core/Guards/email-verified-guard/email-not-verified.guard";
import {FooterComponent} from "./Layout/footer/footer.component";

const routes: Routes = [
  { path: 'footer', component:FooterComponent, canActivate: [authGuard,emailVerifiedGuard] },
  { path:'login', component: LoginPageComponent, canActivate: [guestGuard] },
  { path:'register', component: RegisterPageComponent,canActivate: [guestGuard] },
  { path: 'verifyemail', component: VerifyEmailPageComponent,canActivate: [authGuard,emailNotVerifiedGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
