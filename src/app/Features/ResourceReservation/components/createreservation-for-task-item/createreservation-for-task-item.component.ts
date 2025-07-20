import {
  Component,
  computed,
  effect,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
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
  selectedResourceId = signal<number | null>(null);

  selectedResource = computed(() => {
    const id = this.selectedResourceId();
    return this.listResources.find((r) => r.id === id);
  });
  type: ResourceType = ResourceType.Other;
  constructor(
    private readonly resourceReservationService: ResourceReservationService,
    private readonly resourceService: ResourceService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {

    effect(() => {
      const selected = this.selectedResource();
      if (selected) {
        this.type = selected.type;
      }
    });
  }

  ngOnInit() {
    if (this.taskItemId && this.startTime && this.endTime) {
      this.reservationForm = this.formBuilder.group(
        {
          resourceId: [null as unknown as number, [Validators.required, Validators.min(1)]],
          taskItemId: [this.taskItemId],
          startTime: [this.startTime],
          endTime: [this.endTime],
          notes: [''],
          quantity: [null, [this.optionalQuantityValidator]],
        },
        {
          validators: [this.startBeforeEndValidator],
        },
      );

      this.loadResources();

      this.reservationForm.get('resourceId')?.valueChanges.subscribe((value) => {
        this.selectedResourceId.set(value);
      });
    }
  }

  loadResources() {
    this.resourceService
      .getAll(undefined, undefined, undefined, ResourceStatus.Available, {
        page: 1,
        pageSize: 200000,
      })
      .subscribe({
        next: (data) => {
          this.listResources = data.items;

          for (let item of this.listResources) {
            item = {
              ...item,
              type: this.mapTypeNumberToEnum(parseInt(item.type)),
            };
            console.log(item.type);
          }
        },
        error: (err) => {
          this.toastr.error('There was a Problem loading resources.');
        },
      });
  }
  createReservation() {
    if (this.reservationForm.invalid) {
      this.toastr.error('Please fix the errors before submitting.');
      console.log(this.reservationForm.value);
      return;
    }

    const reservation = this.reservationForm.value;
    this.resourceReservationService.createReservation(reservation).subscribe({
      next: () => {
        this.router.navigate(['/taskitem', this.taskItemId]);
        this.toastr.success('Reservation created');
        this.close.emit(); // Close the modal
      },
      error: (err) => {
        this.toastr.error('Reservation creation failed');
      },
    });
  }

  cancel(): void {
    this.close.emit(); // Close the modal
  }

  private startBeforeEndValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return startDate < endDate ? null : { startAfterEnd: true };
  }

  private optionalQuantityValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value == null || control.value === '') return null;
    return control.value > 0 ? null : { quantityInvalid: true };
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

  protected readonly ResourceType = ResourceType;

  protected readonly parseInt = parseInt;
}
