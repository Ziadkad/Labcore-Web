import {Component, effect} from '@angular/core';
import {AuthService} from "../../Core/Services/auth-service/auth.service";
import {Router} from "@angular/router";
import {UserRole} from "../../Shared/Interfaces/Auth/user-role";
import {environment} from "../../../environments/environment";
import {AuthResponse} from "../../Shared/Interfaces/Auth/auth-response";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isUserMenuOpen: boolean = false;
  isAuthenticated: boolean = this.authService.isAuthenticated();
  userRole: UserRole | undefined;
  currentUser: AuthResponse | null = null;
  imageUrl: string = environment.apiImage;
  constructor
  (
    private readonly authService: AuthService,
   private readonly router: Router,
  ) {
    effect(()=>{
      console.log(this.isAuthenticated);
      this.isAuthenticated = this.authService.isAuthenticated();
      this.currentUser = this.authService.currentUser();
      this.userRole = this.currentUser?.role;
    })
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  protected readonly UserRole = UserRole;
}
