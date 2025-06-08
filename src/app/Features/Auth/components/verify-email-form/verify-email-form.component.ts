import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {ToastrService} from "ngx-toastr";
import {LocalStorageService} from "../../../../Core/Services/local-storage-service/local-storage.service";

@Component({
  selector: 'app-verify-email-form',
  templateUrl: './verify-email-form.component.html',
  styleUrl: './verify-email-form.component.css'
})
export class VerifyEmailFormComponent implements OnInit {
  verifyForm!: FormGroup;
  isSubmitting: boolean = false;
  isResending: boolean = false;
  sentFlag: string | null = null;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly localStorageService: LocalStorageService,
  ) {
  }

  ngOnInit() {
    this.sentFlag = this.localStorageService.getItem('verificationCodeSent');
    if (!this.sentFlag) {
      this.onResend(); // call it once
      localStorage.setItem('verificationCodeSent', 'true'); // set flag
    }
    this.verifyForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }
  onSubmit(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const code = this.verifyForm.value.verificationCode;

    this.authService.verifyEmail(code).subscribe({
      next: () => {
        this.toastr.success('Email successfully verified!');
        this.isSubmitting = false;
        this.localStorageService.removeItem('verificationCodeSent');
      },
      error: () => {
        this.toastr.error('Verification failed. Please check the code.');
        this.isSubmitting = false;
      }
    });
  }

  onResend(): void {
    this.isResending = true;
    this.authService.VerifyRequest().subscribe({
      next: () => {
        this.toastr.success('Verification code resent!');
        this.isResending = false;
      },
      error: () => {
        this.toastr.error('Failed to resend verification code.');
        this.isResending = false;
      }
    });
  }
}
