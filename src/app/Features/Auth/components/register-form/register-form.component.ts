import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../Core/Services/auth-service/auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {Register} from "../../../../Shared/Interfaces/Auth/register";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {
  registerForm!: FormGroup ;
  isSubmitting = false;
  selectedFile: File | null = null;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]],
      gender: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),       // at least one uppercase
        Validators.pattern(/[a-z]/),       // at least one lowercase
        Validators.pattern(/\d/)           // at least one digit
      ]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const formValues = this.registerForm.value;
    const payload: Register = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      gender: formValues.gender,
      password: formValues.password,
      image: this.selectedFile!
    };

    this.isSubmitting = true;

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.toastr.success(`Welcome ${res.firstName}!`, 'Registration Successful', { timeOut: 2000 });
       this.router.navigate(['verifyemail'])
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Registration error:', err);
        this.toastr.error('Registration failed. Please try again.', 'Error', { timeOut: 3000 });
      }
    });
  }

  private passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }
}
