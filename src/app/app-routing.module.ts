import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './Features/Auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './Features/Auth/pages/register-page/register-page.component';
import { VerifyEmailPageComponent } from './Features/Auth/pages/verify-email-page/verify-email-page.component';
import { authGuard } from './Core/Guards/auth-guard/auth.guard';
import { guestGuard } from './Core/Guards/guest-guard/guest.guard';
import { emailNotVerifiedGuard } from './Core/Guards/email-verified-guard/email-not-verified.guard';
import { DashboardPageComponent } from './Features/Dashboard/pages/dashboard-page/dashboard-page.component';
import { ProjectListPageComponent } from './Features/Project/pages/project-list-page/project-list-page.component';
import { ProjectDetailPageComponent } from './Features/Project/pages/project-detail-page/project-detail-page.component';
import { ProjectCreatePageComponent } from './Features/Project/pages/project-create-page/project-create-page.component';
import { ProjectEditPageComponent } from './Features/Project/pages/project-edit-page/project-edit-page.component';
import { StudyCreatePageComponent } from './Features/Study/pages/study-create-page/study-create-page.component';
import { StudyEditPageComponent } from './Features/Study/pages/study-edit-page/study-edit-page.component';
import { StudyDetailPageComponent } from './Features/Study/pages/study-detail-page/study-detail-page.component';
import { TaskItemListPageComponent } from './Features/TaskItem/pages/task-item-list-page/task-item-list-page.component';
import { TaskItemCreatePageComponent } from './Features/TaskItem/pages/task-item-create-page/task-item-create-page.component';
import { TaskItemEditPageComponent } from './Features/TaskItem/pages/task-item-edit-page/task-item-edit-page.component';
import { TaskItemDetailPageComponent } from './Features/TaskItem/pages/task-item-detail-page/task-item-detail-page.component';
import { MyTaskItemsPageComponent } from './Features/TaskItem/pages/my-task-items-page/my-task-items-page.component';
import { ResourceCreatePageComponent } from './Features/Resource/pages/resource-create-page/resource-create-page.component';
import { ResourceEditPageComponent } from './Features/Resource/pages/resource-edit-page/resource-edit-page.component';
import { ResourcelistPageComponent } from './Features/Resource/pages/resourcelist-page/resourcelist-page.component';
import { ResourceDetailPageComponent } from './Features/Resource/pages/resource-detail-page/resource-detail-page.component';
import { MyReservationPageComponent } from './Features/ResourceReservation/pages/my-reservation-page/my-reservation-page.component';
import { multirolesGuard } from './Core/Guards/role-guards/multiroles-guard/multiroles.guard';
import { UserRole } from './Shared/Interfaces/Auth/user-role';
import { UserListComponent } from './Features/User/pages/user-list/user-list.component';
import { adminGuard } from './Core/Guards/role-guards/admin-guard/admin.guard';

const routes: Routes = [
  { path: '', component: DashboardPageComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'login', component: LoginPageComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterPageComponent, canActivate: [guestGuard] },
  {
    path: 'verifyemail',
    component: VerifyEmailPageComponent,
    canActivate: [authGuard, emailNotVerifiedGuard],
  },
  { path: 'project', component: ProjectListPageComponent, canActivate: [authGuard] },
  { path: 'project/:projectId', component: ProjectDetailPageComponent, canActivate: [authGuard] },
  {
    path: 'createproject',
    component: ProjectCreatePageComponent,
    canActivate: [authGuard, multirolesGuard([UserRole.Manager])],
  },
  {
    path: 'editproject/:projectId',
    component: ProjectEditPageComponent,
    canActivate: [authGuard, multirolesGuard([UserRole.Manager])],
  },
  {
    path: 'createstudy/:projectId',
    component: StudyCreatePageComponent,
    canActivate: [authGuard, multirolesGuard([UserRole.Manager, UserRole.Researcher])],
  },
  {
    path: 'editstudy/:studyId',
    component: StudyEditPageComponent,
    canActivate: [authGuard, multirolesGuard([UserRole.Manager, UserRole.Researcher])],
  },
  { path: 'study/:studyId', component: StudyDetailPageComponent, canActivate: [authGuard]},
  { path: 'taskitemlist/:studyId', component: TaskItemListPageComponent, canActivate: [authGuard] },
  { path: 'createtaskitem/:studyId',
    component: TaskItemCreatePageComponent,
    canActivate: [authGuard,multirolesGuard([UserRole.Manager, UserRole.Researcher])],
  },
  { path: 'edittaskitem/:taskItemId', component: TaskItemEditPageComponent, canActivate:[authGuard, multirolesGuard([UserRole.Manager, UserRole.Researcher])],},
  { path: 'taskitem/:taskItemId', component: TaskItemDetailPageComponent,canActivate:[authGuard] },
  { path: 'mytaskitems', component: MyTaskItemsPageComponent, canActivate: [authGuard,multirolesGuard([UserRole.Manager, UserRole.Researcher])] },
  { path: 'createresource', component: ResourceCreatePageComponent, canActivate:[authGuard, multirolesGuard([UserRole.ResourceManager])],},
  { path: 'editresource/:resourceId', component: ResourceEditPageComponent, canActivate: [authGuard, multirolesGuard([UserRole.ResourceManager])], },
  { path: 'resources', component: ResourcelistPageComponent, canActivate: [authGuard] },
  { path: 'resource/:resourceId', component: ResourceDetailPageComponent, canActivate: [authGuard] },
  { path: 'myreservations', component: MyReservationPageComponent,canActivate: [authGuard, multirolesGuard([UserRole.Manager, UserRole.Researcher])] },
  { path: 'users', component: UserListComponent, canActivate: [authGuard,adminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
