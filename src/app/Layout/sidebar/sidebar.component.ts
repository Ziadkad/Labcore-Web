import {Component, effect} from '@angular/core';
import {AuthService} from "../../Core/Services/auth-service/auth.service";
import {AuthResponse} from "../../Shared/Interfaces/Auth/auth-response";
import {environment} from "../../../environments/environment";
import {UserRole} from "../../Shared/Interfaces/Auth/user-role";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarOpen :boolean = false;
  isAuthenticated = this.authService.isAuthenticated();
  showAccountDropdown : boolean = false;
  userRole: UserRole | undefined;
  currentUser: AuthResponse | null = null;
  imageUrl: string = environment.apiImage;
  constructor(private authService: AuthService,
              private router: Router,) {
    effect(()=>{
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
  closeSidebarIfMobile():void{
    if (window.innerWidth < 640) {
      this.isSidebarOpen = false;
    }
  }
}
