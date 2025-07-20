import { Component, computed, effect, signal } from '@angular/core';
import { AuthResponse } from '../../../../Shared/Interfaces/Auth/auth-response';
import { Guid } from '../../../../Shared/Interfaces/Common/Guid';
import { AuthService } from '../../../../Core/Services/auth-service/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResourceReservationService } from '../../../../Core/Services/resource-service/resource-reservation.service';
import { PageQueryRequest } from '../../../../Shared/Interfaces/Common/page-query-request';
import {
  ResourceReservationWithResource
} from '../../../../Shared/Interfaces/Resource/ResourceReservation/resource-reservation-with-resource';

@Component({
  selector: 'app-my-reservation-page',
  templateUrl: './my-reservation-page.component.html',
  styleUrl: './my-reservation-page.component.css'
})
export class MyReservationPageComponent {
  loading = signal(false);
  currentUser: AuthResponse | null = null;
  userId : Guid | undefined;
  reservationList = signal<ResourceReservationWithResource[]>([]);
  private _startTime = signal<Date | undefined>(new Date());
  private _endTime = signal<Date | undefined>(undefined);
  pageQuery = signal<PageQueryRequest>({ page: 1, pageSize: 100000 });

  constructor(private readonly authService: AuthService,
              private readonly router: Router,
              private readonly resourceReservationService: ResourceReservationService ,
              private readonly toastr: ToastrService,
  ) {
    effect(() => {
      this.currentUser = this.authService.currentUser();
      this.userId = this.currentUser?.id;
      const params = this.filterParams(); // just track dependencies
      if (this.userId) {
        queueMicrotask(() => this.loadReservation(params)); // async update
      }
    });
  }

  private readonly filterParams = computed(() => ({
    reservedBy: this.userId,
    startTime: this._startTime(),
    endTime: this._endTime(),
    pageQuery: this.pageQuery()
  }));

  loadReservation(params: {
    reservedBy?: string;
    startTime?: Date;
    endTime?: Date;
    pageQuery?: PageQueryRequest;
  }) {
    this.loading.set(true);
    console.log("called = "+params )
    this.resourceReservationService.getReservations(undefined,undefined,params.reservedBy,undefined,params.startTime,params.endTime,params.pageQuery).subscribe({
      next: (res) => {
        this.reservationList.set(res.items || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.toastr.error('Failed to load reservations');
        this.loading.set(false);
      }
    });
  }


  deleteReservation(id : number) {
    const confirmed = window.confirm('Are you sure you want to delete this reservation?');
    if (!confirmed) return;
    this.resourceReservationService.deleteReservation(id).subscribe({
      next: data => {
        this.toastr.success('Reservation deleted');
      },
      error: (err) => {
        this.toastr.error('There was an issue deleting Reservation');
      }
    })
  }

  get startTime(): Date | undefined {
    return this._startTime();
  }

  set startTime(value: Date) {
    if (value) {
      this._startTime.set(new Date(value));
    } else {
      this._startTime.set(undefined);
    }  }

  get endTime(): Date | undefined {
    return this._endTime();
  }

  set endTime(value: Date | string | undefined) {
    if (value) {
      this._endTime.set(new Date(value));
    } else {
      this._endTime.set(undefined);
    }
  }

}
