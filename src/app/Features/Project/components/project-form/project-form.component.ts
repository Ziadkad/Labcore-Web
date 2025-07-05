import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../../../Core/Services/project-service/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Guid} from "../../../../Shared/Interfaces/Common/Guid";
import {ProjectStatus} from "../../../../Shared/Interfaces/Project/Project/project-status";
import {UpdateProjectInterface} from "../../../../Shared/Interfaces/Project/Project/update-project-interface";
import {User} from "../../../../Shared/Interfaces/User/user";
import {UserService} from "../../../../Core/Services/user-service/user.service";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {editorModules} from "../../../../Shared/Quilljs/editorModules";

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  Form! : FormGroup;
  add : boolean = true;
  id! : Guid;
  submitted: boolean = false;
  researchers : User[]=[];

  constructor(private readonly projectService: ProjectService,
              private readonly route : ActivatedRoute,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              private readonly toastr: ToastrService,
              private readonly userService : UserService) {
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['projectId']) {
        this.add = false;
        this.id = params['projectId'];
        this.projectService.getProjectById(params['projectId']).subscribe(data => {
              this.patchForm({
                id: data.id,
                name: data.name,
                description: data.description ?? '',
                startDate: data.startDate,
                endDate: data.endDate,
                status: data.status,
                isPublic: data.isPublic,
                tags: data.tags,
                researchers: data.researchers
              });
          },
          (error) => {
            this.toastr.error("Failed to get the ticket. Please try again.", "Error", {
              timeOut: 4000,
            });
          }
        )
      }
    });

    this.Form = this.formBuilder.group({
      id: [null as unknown as Guid],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: [null as unknown as ProjectStatus],
      isPublic: [false],
      tags: [[]],
      researchers: [[]]
    });


    this.loadResearchers();
    console.log(this.researchers);
  }

  patchForm(data: UpdateProjectInterface): void {
    const statusIndex = data.status as unknown as number;
    const statusString = Object.values(ProjectStatus)[statusIndex] as ProjectStatus;
    this.Form.patchValue({
      id: data.id,
      name: data.name,
      description: data.description,
      startDate: new Date(data.startDate).toISOString().slice(0, 10),
      endDate: new Date(data.endDate).toISOString().slice(0, 10),
      status: statusString,
      isPublic: data.isPublic,
      tags: data.tags,
      researchers: data.researchers
    });
  }


  onSubmitForm(){
    this.submitted = true;
    if(this.Form.valid) {
      if (this.add) {
        console.log(this.Form)
        this.createProject();

      } else {
        this.editProject();
      }
    }
  }

  createProject() {
    console.log("Creating new project...");
    this.projectService.createProject(this.Form.value).subscribe({
      next: (data) => {
        this.toastr.success("Your project was added successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/project', data.id]);
      },
      error: (error) => {
        this.toastr.error("Failed to add the project. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    });
  }
  editProject() {
    this.projectService.updateProject(this.Form.value).subscribe({
      next: (data) => {
        this.toastr.success("The project was updated successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/project', data.id]);
      },
      error: (error) => {
        this.toastr.error("Failed to update the project. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    });
  }

  loadResearchers() {
    this.userService.getAllUsers(  undefined,
      undefined,
      undefined,
      [UserRole.Researcher], { page: 1, pageSize: 500 }).subscribe(data=>{
      this.researchers = data.items;
    })
  }
  editorModules = editorModules;
  projectStatusOptions = Object.values(ProjectStatus)
}
