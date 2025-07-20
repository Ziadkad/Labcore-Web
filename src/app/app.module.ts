import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { ProjectCardComponent } from './Features/Project/components/project-card/project-card.component';
import { ProjectListPageComponent } from './Features/Project/pages/project-list-page/project-list-page.component';
import { ProjectDetailPageComponent } from './Features/Project/pages/project-detail-page/project-detail-page.component';
import { ProjectCreatePageComponent } from './Features/Project/pages/project-create-page/project-create-page.component';
import { ProjectEditPageComponent } from './Features/Project/pages/project-edit-page/project-edit-page.component';
import { ProjectFormComponent } from './Features/Project/components/project-form/project-form.component';
import { StudyEditPageComponent } from './Features/Study/pages/study-edit-page/study-edit-page.component';
import { StudyDetailPageComponent } from './Features/Study/pages/study-detail-page/study-detail-page.component';
import { StudyCreatePageComponent } from './Features/Study/pages/study-create-page/study-create-page.component';
import { StudyFormComponent } from './Features/Study/components/study-form/study-form.component';
import { StudyCardComponent } from './Features/Study/components/study-card/study-card.component';
import { TaskFormComponent } from './Features/TaskItem/components/task-form/task-form.component';
import { TaskItemCreatePageComponent } from './Features/TaskItem/pages/task-item-create-page/task-item-create-page.component';
import { TaskItemEditPageComponent } from './Features/TaskItem/pages/task-item-edit-page/task-item-edit-page.component';
import { DashboardPageComponent } from './Features/Dashboard/pages/dashboard-page/dashboard-page.component';
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {QuillModule} from "ngx-quill";
import {NgSelectModule} from "@ng-select/ng-select";
import { TaskItemListPageComponent } from './Features/TaskItem/pages/task-item-list-page/task-item-list-page.component';
import { TaskItemTableComponent } from './Features/TaskItem/components/task-item-table/task-item-table.component';
import { TaskItemDetailPageComponent } from './Features/TaskItem/pages/task-item-detail-page/task-item-detail-page.component';
import { MyTaskItemsCalendarComponent } from './Features/TaskItem/components/my-task-items-calendar/my-task-items-calendar.component';
import { MyTaskItemsPageComponent } from './Features/TaskItem/pages/my-task-items-page/my-task-items-page.component';
import {
  AgendaService,
  DayService, MonthService,
  RecurrenceEditorModule,
  ScheduleModule,
  WeekService,
  WorkWeekService,
} from '@syncfusion/ej2-angular-schedule';
import { ResourceCreatePageComponent } from './Features/Resource/pages/resource-create-page/resource-create-page.component';
import { ResourceEditPageComponent } from './Features/Resource/pages/resource-edit-page/resource-edit-page.component';
import { ResourceDetailPageComponent } from './Features/Resource/pages/resource-detail-page/resource-detail-page.component';
import { ResourcelistPageComponent } from './Features/Resource/pages/resourcelist-page/resourcelist-page.component';
import { ResourceFormComponent } from './Features/Resource/components/resource-form/resource-form.component';
import { ResourceTableComponent } from './Features/Resource/components/resource-table/resource-table.component';
import { CreatereservationComponent } from './Features/ResourceReservation/components/createreservation/createreservation.component';
import { CreatereservationForTaskItemComponent } from './Features/ResourceReservation/components/createreservation-for-task-item/createreservation-for-task-item.component';
import { MyReservationPageComponent } from './Features/ResourceReservation/pages/my-reservation-page/my-reservation-page.component';
import { UserListComponent } from './Features/User/pages/user-list/user-list.component';
import { UserTableComponent } from './Features/User/components/user-table/user-table.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginPageComponent,
    RegisterPageComponent,
    LoginFormComponent,
    RegisterFormComponent,
    VerifyEmailFormComponent,
    VerifyEmailPageComponent,
    ProjectCardComponent,
    ProjectListPageComponent,
    ProjectDetailPageComponent,
    ProjectCreatePageComponent,
    ProjectEditPageComponent,
    ProjectFormComponent,
    StudyEditPageComponent,
    StudyDetailPageComponent,
    StudyCreatePageComponent,
    StudyFormComponent,
    StudyCardComponent,
    TaskFormComponent,
    TaskItemCreatePageComponent,
    TaskItemEditPageComponent,
    DashboardPageComponent,
    TaskItemListPageComponent,
    TaskItemTableComponent,
    TaskItemDetailPageComponent,
    MyTaskItemsCalendarComponent,
    MyTaskItemsPageComponent,
    ResourceCreatePageComponent,
    ResourceEditPageComponent,
    ResourceDetailPageComponent,
    ResourcelistPageComponent,
    ResourceFormComponent,
    ResourceTableComponent,
    CreatereservationComponent,
    CreatereservationForTaskItemComponent,
    MyReservationPageComponent,
    UserListComponent,
    UserTableComponent,
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
    NgxSliderModule,
    QuillModule.forRoot(),
    NgSelectModule,
    ScheduleModule,
    RecurrenceEditorModule,
  ],
  providers:  [appConfig,
    DayService,
    WeekService,
    WorkWeekService,
    MonthService,
    AgendaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
