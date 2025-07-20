import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../Core/Services/user-service/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService } from '../../../../Core/Services/resource-service/resource.service';
import { ResourceType } from '../../../../Shared/Interfaces/Resource/Resource/resource-type';
import { ResourceStatus } from '../../../../Shared/Interfaces/Resource/Resource/resource-status';
import { ResourceWithReservations } from '../../../../Shared/Interfaces/Resource/Resource/resource-with-reservations';

@Component({
  selector: 'app-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrl: './resource-form.component.css',
})
export class ResourceFormComponent implements OnInit {
  isAdd: boolean = true;
  resourceForm!: FormGroup;
  submitted: boolean = false;
  resourceId!: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly resourceService: ResourceService,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null as unknown as number],
      name: ['', [Validators.required]],
      type: [null as unknown as ResourceType, [Validators.required]],
      description: [''],
      quantityAvailable: [null as unknown as number],
      status: [null as unknown as ResourceStatus, [Validators.required]],
    })
    this.route.params.subscribe(params => {
      if (params['resourceId']) {
        this.isAdd = false;
        this.resourceService.getById(params['resourceId']).subscribe({
          next: data => {
            this.patchForm(data);
            this.resourceId = data.id;
          },
          error: ():void => {this.router.navigate(['/resources'])}// En cas d'erreur, redirection
          })
      }
    })

  }

  patchForm(data : ResourceWithReservations): void {
    const typeIndex = data.type as unknown as number;
    const ResourceTypeString = Object.values(ResourceType)[typeIndex] as ResourceType;
    const statusIndex = data.status as unknown as number;
    const ResourceStatusString = Object.values(ResourceStatus)[statusIndex] as ResourceStatus;
    this.resourceForm.patchValue({
      id: data.id,
      name: data.name,
      type: ResourceTypeString,
      description: data.description,
      quantityAvailable: data.quantityAvailable,
      status: ResourceStatusString,
    });
  }


  onSubmitForm(){
    this.submitted = true;
    console.log(this.resourceForm.value);
    if(this.resourceForm.valid) {
      if (this.isAdd) {
        this.createResource();
      } else {
        this.editResource();
      }
    }
  }

  createResource(){
    this.resourceService.create(this.resourceForm.value).subscribe({
      next: data => {
        this.toastr.success("Your Resource was added successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/resource', data.id]);
      },
      error: (error) => {
        this.toastr.error("Failed to add the Resource. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    })
  }

  editResource(){
    this.resourceService.update(this.resourceId,this.resourceForm.value).subscribe({
      next: data => {
        this.toastr.success("Your resource was updated successfully", "Success", {
          timeOut: 2000,
        });
        this.router.navigate(['/resource', data.id]);
      },
      error: (error) => {
        this.toastr.error("Failed to update the Resource. Please try again.", "Error", {
          timeOut: 4000,
        });
      }
    })
  }

  cancel(){
    if(!this.isAdd){
      this.router.navigate(['/resource', this.resourceId])
    }
    else{
      this.router.navigate(['/resources'])
    }
  }


  get showQuantityField(): boolean {
    const type = this.resourceForm.get('type')?.value;
    return type === ResourceType.Consumable;
  }


  resourceStatusOption = Object.values(ResourceStatus);
  resourceTypeOption = Object.values(ResourceType);
}
