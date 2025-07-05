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
import {DashboardPageComponent} from "./Features/Dashboard/pages/dashboard-page/dashboard-page.component";
import {ProjectListPageComponent} from "./Features/Project/pages/project-list-page/project-list-page.component";
import {ProjectDetailPageComponent} from "./Features/Project/pages/project-detail-page/project-detail-page.component";
import {ProjectCreatePageComponent} from "./Features/Project/pages/project-create-page/project-create-page.component";
import {ProjectEditPageComponent} from "./Features/Project/pages/project-edit-page/project-edit-page.component";
import {StudyCreatePageComponent} from "./Features/Study/pages/study-create-page/study-create-page.component";
import {StudyEditPageComponent} from "./Features/Study/pages/study-edit-page/study-edit-page.component";
import {StudyDetailPageComponent} from "./Features/Study/pages/study-detail-page/study-detail-page.component";
import {TaskItemListPageComponent} from "./Features/TaskItem/pages/task-item-list-page/task-item-list-page.component";
import {
  TaskItemCreatePageComponent
} from "./Features/TaskItem/pages/task-item-create-page/task-item-create-page.component";
import {TaskItemEditPageComponent} from "./Features/TaskItem/pages/task-item-edit-page/task-item-edit-page.component";
import {
  TaskItemDetailPageComponent
} from "./Features/TaskItem/pages/task-item-detail-page/task-item-detail-page.component";
import {MyTaskItemsPageComponent} from "./Features/TaskItem/pages/my-task-items-page/my-task-items-page.component";

const routes: Routes = [
  { path: '', component: DashboardPageComponent},
  { path: 'dashboard', component: DashboardPageComponent},
  { path: 'footer', component:FooterComponent, canActivate: [authGuard,emailVerifiedGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterPageComponent,canActivate: [guestGuard] },
  { path: 'verifyemail', component: VerifyEmailPageComponent,canActivate: [authGuard,emailNotVerifiedGuard] },
  { path: 'project', component: ProjectListPageComponent},
  { path: 'project/:projectId', component: ProjectDetailPageComponent},
  { path: 'createproject', component: ProjectCreatePageComponent},
  { path: 'editproject/:projectId', component: ProjectEditPageComponent},
  { path: 'createstudy/:projectId', component: StudyCreatePageComponent},
  { path: 'editstudy/:studyId', component: StudyEditPageComponent},
  { path: 'study/:studyId', component: StudyDetailPageComponent},
  { path: 'taskitemlist/:studyId', component: TaskItemListPageComponent},
  { path: 'createtaskitem/:studyId', component: TaskItemCreatePageComponent},
  { path: 'edittaskitem/:taskItemId', component: TaskItemEditPageComponent},
  { path: 'taskitem/:taskItemId', component: TaskItemDetailPageComponent},
  { path: 'mytaskitems', component: MyTaskItemsPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
