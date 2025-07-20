import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Resource } from '../../../../Shared/Interfaces/Resource/Resource/resource';
import {
  CreateResourceReservationInterface
} from '../../../../Shared/Interfaces/Resource/ResourceReservation/create-resource-reservation-interface';
import { ResourceReservationService } from '../../../../Core/Services/resource-service/resource-reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ResourceType } from '../../../../Shared/Interfaces/Resource/Resource/resource-type';

@Component({
  selector: 'app-createreservation',
  templateUrl: './createreservation.component.html',
  styleUrl: './createreservation.component.css'
})
export class CreatereservationComponent implements OnInit {
  @Input() resource!: Resource;
  reservationForm!: FormGroup;
  @Output() close = new EventEmitter<void>();


  constructor(private readonly resourceReservationService: ResourceReservationService,
              private readonly toastr: ToastrService,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    if (this.resource?.id) {
      this.reservationForm = this.formBuilder.group({
        resourceId: [this.resource?.id, [Validators.required, Validators.min(1)]],
        taskItemId: [null],
        startTime: [null, [Validators.required, this.startTimeFutureValidator.bind(this)]],
        endTime: [null, [Validators.required]],
        notes: [''],
        quantity: [null, [this.optionalQuantityValidator]]
      }, {
        validators: [this.startBeforeEndValidator]
      });
    }
  }


  createReservation() {
    if (this.reservationForm.invalid) {
      this.toastr.error('Please fix the errors before submitting.');
      console.log(this.reservationForm.value)
      return;
    }

    const reservation = this.reservationForm.value;
    this.resourceReservationService.createReservation(reservation).subscribe({
      next: () => {
        this.router.navigate(['/resource', this.resource.id]);
        this.toastr.success('Reservation created');
        this.close.emit(); // Close the modal
      },
      error: err => {
        this.toastr.error('Reservation creation failed');
      }
    });
  }

  cancel(): void {
    this.close.emit(); // Close the modal
  }

  private startTimeFutureValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const now = new Date();
    const input = new Date(control.value);
    return input.getTime() > now.getTime() ? null : { startTimeInPast: true };
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


  protected readonly ResourceType = ResourceType;
}
