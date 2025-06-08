import {Component, effect} from '@angular/core';
import {AuthService} from "../../Core/Services/auth-service/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSidebarOpen :boolean = false;
  isAuthenticated = this.authService.isAuthenticated();

  constructor(private authService: AuthService) {
    effect(()=>{
      console.log(this.isAuthenticated);
      this.isAuthenticated = this.authService.isAuthenticated();
    })
  }


  closeSidebarIfMobile():void{
    if (window.innerWidth < 640) {
      this.isSidebarOpen = false;
    }
  }
}
