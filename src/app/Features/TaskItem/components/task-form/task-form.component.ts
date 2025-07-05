import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {TaskItem} from "../../../../Shared/Interfaces/Project/TaskItem/task-item";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {TaskItemService} from "../../../../Core/Services/project-service/task-item.service";
import {TaskItemStatus} from "../../../../Shared/Interfaces/Project/TaskItem/task-item-status";
import {Study} from "../../../../Shared/Interfaces/Project/Study/study";
import {User} from "../../../../Shared/Interfaces/User/user";
import {StudyService} from "../../../../Core/Services/project-service/study.service";
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {Project} from "../../../../Shared/Interfaces/Project/Project/project";
import {UserService} from "../../../../Core/Services/user-service/user.service";
import {switchMap, tap} from "rxjs";

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  isAdd: boolean = true;
  taskItemForm! : FormGroup;
  submitted: boolean = false;
  studyId! : Guid;
  taskItemId!: Guid;
  eligibleAssignees: User[] =[];
  constructor(private readonly formBuilder: FormBuilder,
              private readonly taskItemService: TaskItemService,
              private readonly studyService: StudyService,
              private readonly projectService: ProjectService,
              private readonly userService : UserService,
              private readonly toastr: ToastrService,
              private readonly route : ActivatedRoute,
              private readonly router: Router,
  ) {

  }

  ngOnInit(): void {
    this.taskItemForm = this.formBuilder.group({
      id: [null as unknown as Guid],
      label: ['', Validators.required],
      description: ['', Validators.required],
      assignedTo: [[] as Guid[]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      taskItemStatus: [null as unknown as TaskItemStatus],
      reviewNotes: [''],
      studyId: [null],
    })


    this.route.params.subscribe(params => {
      if (params['studyId']) {
        this.isAdd = true;
        this.studyId = params['studyId'];
        this.taskItemForm.patchValue({ studyId: params['studyId'] } as Partial<Study>);
        this.loadAssignees(params['studyId']).subscribe(data => {
          console.log(data);
        });
      }
      else if (params['taskItemId']) {
        this.isAdd = false;
        this.taskItemId = params['taskItemId'];
        this.taskItemService.getTaskItem(this.taskItemId).subscribe({
          next: (taskItem: TaskItem) => {
              this.patchForm({
                id: this.taskItemId,
                label: taskItem.label,
                assignedTo: taskItem.assignedTo,
                description: taskItem.description,
                startDate: new Date(taskItem.startDate).toISOString().slice(0, 16),
                endDate: new Date(taskItem.endDate).toISOString().slice(0, 16),
                taskItemStatus: taskItem.taskItemStatus,
                reviewNotes: taskItem.reviewNotes,
              })
            this.loadAssignees(taskItem.studyId).subscribe()
          },
          error: ():void => {this.router.navigate(['/'])}// En cas d'erreur, redirection
        });
      }
      else {
        this.router.navigate(['/']);
      }
    });

  }


  patchForm(data : any): void {
    const statusIndex = data.taskItemStatus as unknown as number;
    const taskItemStatusString = Object.values(TaskItemStatus)[statusIndex] as TaskItemStatus;
    this.taskItemForm.patchValue({
      id: data.id,
      label: data.label,
      assignedTo: data.assignedTo as Guid[],
      description: data.description,
      startDate: new Date(data.startDate).toISOString().slice(0, 16), // 'YYYY-MM-DDTHH:mm'
      endDate: new Date(data.endDate).toISOString().slice(0, 16),
      taskItemStatus: taskItemStatusString,
      reviewNotes : data.reviewNotes,
      studyId: data.studyId,
    });
  }

  onSubmitForm(){
    this.submitted = true;
    console.log(this.taskItemForm.value);
    if(this.taskItemForm.valid) {
      if (this.isAdd) {
        this.createTaskItem();

      } else {

        this.editTaskItem();
      }
    }

  }


  loadAssignees(studyId: Guid) {
      return this.studyService.getStudy(studyId).pipe(
        switchMap((study: Study) =>
          this.projectService.getProjectById(study.projectId)
        ),
        switchMap((project: Project) => {
          const researcherIds = [
            ...project.researchers,
            project.managerId
          ] as Guid[];

          return this.userService.getAllUsers(
            researcherIds,
            undefined,
            undefined,
            undefined,
            { page: 1, pageSize: 500 }
          );
        }),
        tap(resp => (this.eligibleAssignees = resp.items))
      );
  }

  createTaskItem(){
    this.taskItemService.createTaskItem(this.taskItemForm.value).subscribe({
      next: (data) => {
        this.toastr.success("Your TaskItem was added successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/taskitem', data.id]);
      },
      error: (error) => {
        this.toastr.error("Failed to add the TaskItem. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    });
  }

  editTaskItem(){
    this.taskItemService.updateTaskItem(this.taskItemId,this.taskItemForm.value).subscribe({
      next: (data) => {
        this.toastr.success("The TaskItem  was updated successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/taskitem', data.id]);
      },
      error: (error) => {
        this.toastr.error("Failed to update the TaskItem. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    });
  }

  cancel(){
    if(!this.isAdd){
      this.router.navigate(['/taskItem', this.taskItemId])
    }
    else{
      this.router.navigate(['/taskitemlist', this.studyId])
    }
  }

  taskItemStatusOptions = Object.values(TaskItemStatus);
}
