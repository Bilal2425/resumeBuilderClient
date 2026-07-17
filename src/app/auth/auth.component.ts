import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserLogin, UserRegister } from '../models/user.model';
import { ToastService } from '../services/toast.service';

declare const google: any;

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private ngZone = inject(NgZone);

  loginForm: FormGroup;
  registerForm: FormGroup;
  forgotForm: FormGroup;
  resetForm: FormGroup;

  isLoginMode = true;
  showLoginPassword = false;
  showRegisterPassword = false;
  showNewPassword = false;
  errorMessage: string | null = null;

  // Forgot password flow
  forgotStep: 'idle' | 'email' | 'reset' | 'done' = 'idle';
  isLoadingForgot = false;
  forgotSuccessMessage: string | null = null;

  // Loading state
  isLoading = false;

  // Google Client ID — replace with your actual ID from Google Cloud Console
  private readonly GOOGLE_CLIENT_ID = '113734501131-d8s8632bijn8032lvp250l380m0jb478.apps.googleusercontent.com';
  private googleScriptEl: HTMLScriptElement | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      inviteCode: ['', Validators.required]
    });

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loadGoogleScript();
  }

  ngOnDestroy() {
    if (this.googleScriptEl) {
      document.body.removeChild(this.googleScriptEl);
    }
  }

  private loadGoogleScript() {
    if (typeof window === 'undefined') return; // SSR guard
    if (document.getElementById('google-gsi-script')) {
      this.initializeGoogle();
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogle();
    document.body.appendChild(script);
    this.googleScriptEl = script;
  }

  private initializeGoogle() {
    if (typeof google === 'undefined') return;
    google.accounts.id.initialize({
      client_id: this.GOOGLE_CLIENT_ID,
      callback: (response: any) => this.ngZone.run(() => this.handleGoogleCallback(response))
    });
  }

  handleGoogleCallback(response: any) {
    const credential = response.credential;
    this.isLoading = true;
    this.errorMessage = null;
    this.authService.googleLogin(credential).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authService.storeToken(res.token);
        localStorage.setItem('resumeData', JSON.stringify(res.resume));
        this.toastService.success('Signed in with Google!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Google sign-in failed. Please try again.';
        this.toastService.error(this.errorMessage!);
      }
    });
  }

  signInWithGoogle() {
    if (typeof google === 'undefined') {
      this.toastService.error('Google Sign-In is not available. Check your internet connection.');
      return;
    }
    google.accounts.id.prompt();
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
    this.forgotStep = 'idle';
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = null;

    const userLogin: UserLogin = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.loginUser(userLogin).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.storeToken(response.token);
        localStorage.setItem('resumeData', JSON.stringify(response.resume));
        this.toastService.success('Welcome back to ResumeCraft!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.toastService.error(this.errorMessage!);
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = null;

    const userRegister: UserRegister = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      inviteCode: this.registerForm.value.inviteCode
    };

    this.authService.registerUser(userRegister).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastService.success('Account created! Please log in.');
        this.isLoginMode = true;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed. Please try again.';
        this.toastService.error(this.errorMessage!);
      }
    });
  }

  openForgotPassword(event: Event) {
    event.preventDefault();
    this.forgotStep = 'email';
    this.errorMessage = null;
    this.forgotSuccessMessage = null;
    this.forgotForm.reset();
    this.resetForm.reset();
  }

  onForgotSubmit() {
    if (this.forgotForm.invalid) return;
    this.isLoadingForgot = true;
    this.errorMessage = null;

    this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res) => {
        this.isLoadingForgot = false;
        this.forgotSuccessMessage = res.token
          ? `Dev mode: Your reset token is: ${res.token}`
          : res.message;
        
        // Auto-populate the reset token if it is returned (in dev/debug mode)
        if (res.token) {
          this.resetForm.patchValue({ token: res.token });
        }
        
        this.forgotStep = 'reset';
      },
      error: () => {
        this.isLoadingForgot = false;
        this.errorMessage = 'Request failed. Please try again.';
      }
    });
  }

  onResetSubmit() {
    if (this.resetForm.invalid) return;
    this.isLoadingForgot = true;
    this.errorMessage = null;

    this.authService.resetPassword(
      this.resetForm.value.token,
      this.resetForm.value.newPassword
    ).subscribe({
      next: () => {
        this.isLoadingForgot = false;
        this.forgotStep = 'done';
        this.toastService.success('Password reset! Please log in with your new password.');
      },
      error: (err) => {
        this.isLoadingForgot = false;
        this.errorMessage = 'Reset failed. Token may be invalid or expired.';
      }
    });
  }

  backToLogin() {
    this.forgotStep = 'idle';
    this.errorMessage = null;
    this.forgotSuccessMessage = null;
  }
}
