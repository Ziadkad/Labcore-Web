import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Guid } from '../../../../Shared/Interfaces/Common/Guid';
import { ResourceReservationService } from '../../../../Core/Services/resource-service/resource-reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ResourceType } from '../../../../Shared/Interfaces/Resource/Resource/resource-type';
import { ResourceService } from '../../../../Core/Services/resource-service/resource.service';
import { ResourceStatus } from '../../../../Shared/Interfaces/Resource/Resource/resource-status';
import { Resource } from '../../../../Shared/Interfaces/Resource/Resource/resource';

@Component({
  selector: 'app-createreservation-for-task-item',
  templateUrl: './createreservation-for-task-item.component.html',
  styleUrl: './createreservation-for-task-item.component.css',
})
export class CreatereservationForTaskItemComponent implements OnInit {
  @Input() taskItemId!: Guid;
  @Input() startTime!: Date;
  @Input() endTime!: Date;
  @Output() close = new EventEmitter<void>();

  reservationForm!: FormGroup;
  listResources: Resource[] = [];
  selectedResourceType: ResourceType | null = null;

  readonly ResourceType = ResourceType;

  constructor(
    private resourceReservationService: ResourceReservationService,
    private resourceService: ResourceService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadResources();

    this.reservationForm.get('resourceId')?.valueChanges.subscribe((value: number) => {
      const resource = this.listResources.find((r) => r.id === value);
      this.selectedResourceType = resource?.type ?? null;
    });
  }

  private initForm(): void {
    this.reservationForm = this.formBuilder.group(
      {
        resourceId: [null, [Validators.required, Validators.min(1)]],
        taskItemId: [this.taskItemId],
        startTime: [this.startTime],
        endTime: [this.endTime],
        notes: [''],
        quantity: [null, [this.optionalQuantityValidator]],
      },
      { validators: [this.startBeforeEndValidator] }
    );
  }

  private loadResources(): void {
    this.resourceService
      .getAll(undefined, undefined, undefined, ResourceStatus.Available, {
        page: 1,
        pageSize: 200000,
      })
      .subscribe({
        next: (response) => {
          this.listResources = response.items.map((item) => ({
            ...item,
            type: this.mapTypeNumberToEnum(Number(item.type)),
          }));
        },
        error: () => {
          this.toastr.error('There was a problem loading resources.');
        },
      });
  }

  createReservation(): void {
    if (this.reservationForm.invalid) {
      this.toastr.error('Please fix the errors before submitting.');
      return;
    }

    const reservation = this.reservationForm.value;

    this.resourceReservationService.createReservation(reservation).subscribe({
      next: () => {
        this.toastr.success('Reservation created');
        this.router.navigate(['/taskitem', this.taskItemId]);
        this.close.emit();
      },
      error: () => {
        this.toastr.error('Reservation creation failed');
      },
    });
  }

  cancel(): void {
    this.close.emit();
  }

  private startBeforeEndValidator(group: AbstractControl): ValidationErrors | null {
    const start = new Date(group.get('startTime')?.value);
    const end = new Date(group.get('endTime')?.value);

    return start < end ? null : { startAfterEnd: true };
  }

  private optionalQuantityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value == null || value === '' || value > 0 ? null : { quantityInvalid: true };
  }


  trackByResourceId(index: number, item: Resource): any {
    return item?.id ?? index;
  }


  mapTypeNumberToEnum(value: number): ResourceType {
    const map: { [key: number]: ResourceType } = {
      0: ResourceType.Consumable,
      1: ResourceType.Room,
      2: ResourceType.Tool,
      3: ResourceType.Other,
    };
    return map[value];
  }

}
