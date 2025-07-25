  import { Component, Input } from '@angular/core';
  import { User } from '../../../../Shared/Interfaces/User/user';
  import { Gender } from '../../../../Shared/Interfaces/Auth/gender';
  import { UserRole } from '../../../../Shared/Interfaces/Auth/user-role';
  import { UserService } from '../../../../Core/Services/user-service/user.service';
  import { ToastrService } from 'ngx-toastr';
  import { Guid } from '../../../../Shared/Interfaces/Common/Guid';

  @Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrl: './user-table.component.css'
  })
  export class UserTableComponent {
   @Input() users: User[] = [];

    userRoles = Object.keys(UserRole)
      .filter(key => !isNaN(Number(UserRole[key as any])))
      .map(key => ({
        label: key,
        value: UserRole[key as keyof typeof UserRole]
      }));

    protected readonly Gender = Gender;
    protected readonly UserRole = UserRole;

    constructor(
      private userService: UserService,
      private toastr: ToastrService
    ) {}

    onRoleChange(newRole: UserRole, userId: Guid) {
      this.userService.giveRole({ userId, role: newRole }).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === userId);
          if (index !== -1) {
            this.users[index].role = updatedUser.role;
          }
          this.toastr.success("Role updated successfully.");
        },
        error: (err) => {
          this.toastr.error("Failed to update role.");
          console.error(err);
        }
      });
    }


    onResetPassword( id:Guid){
      const confirmed = window.confirm('Are you sure you want to reset the password for this user?');

      if (!confirmed) {
        return;
      }

      this.toastr.success('Password reset email has been sent.');

    }
  }
