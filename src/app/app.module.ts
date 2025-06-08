import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Layout/navbar/navbar.component';
import { FooterComponent } from './Layout/footer/footer.component';
import { SidebarComponent } from './Layout/sidebar/sidebar.component';
import { LoginPageComponent } from './Features/Auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './Features/Auth/pages/register-page/register-page.component';
import { LoginFormComponent } from './Features/Auth/components/login-form/login-form.component';
import { RegisterFormComponent } from './Features/Auth/components/register-form/register-form.component';
import { VerifyEmailFormComponent } from './Features/Auth/components/verify-email-form/verify-email-form.component';
import { VerifyEmailPageComponent } from './Features/Auth/pages/verify-email-page/verify-email-page.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import {appConfig} from "./Core/Interceptors/appConfig";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    LoginPageComponent,
    RegisterPageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    VerifyEmailFormComponent,
    VerifyEmailPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers:  [appConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
