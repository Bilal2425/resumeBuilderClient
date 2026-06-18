import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserLogin, UserRegister } from '../models/user.model';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true; // Default to login mode
  errorMessage: string | null = null; 

  constructor()
  {
    // Intilalizing the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onLogin(){
    if (this.loginForm.invalid) return;

    const userLogin: UserLogin = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.loginUser(userLogin).subscribe({
      next: (response) => {
        this.authService.storeToken(response.token)
        localStorage.setItem('resumeData', JSON.stringify(response.resume));
        this.toastService.success('Welcome back to ResumeCraft!');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.toastService.error(this.errorMessage);
      }
    });
  }

  onRegister()
  {
    if (this.registerForm.invalid) return;

    const userRegister: UserRegister = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.registerUser(userRegister).subscribe({
      next: (response) => {
        this.toastService.success('Account created! Please log in.');
        this.isLoginMode = true;
      },
      error: (error) => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.toastService.error(this.errorMessage);
      }
    });
  }
}


