import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserLogin, UserRegister } from '../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true; // Default to login mode
  errorMessage: string | null = null; 

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router)
  {
    // Intilalizing the login form
    this.loginForm = this.fb.group({
      email: ['', Validators.required, Validators.email],
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
    const userLogin: UserLogin = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.loginUser(userLogin).subscribe(response => {
      this.authService.storeToken(response.token)

      localStorage.setItem('resumeData', JSON.stringify(response.resume));
      console.log('Login successful:', response)
      this.router.navigate(['/dashboard']);
    },
    error => {
      this.errorMessage = 'Login failed. Please check your credentials.';
      console.error('Login failed:', error);
    }
   );
  }

  onRegister()
  {
    const userRegister: UserRegister = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.authService.registerUser(userRegister).subscribe(response => {
      console.log('Registration successful:', response);
      this.toggleMode();
    },
    error => {
      this.errorMessage = 'Registration failed. Please try again.';
      console.error('Registration failed:', error);
    }
   );
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/authComponent']);
  }

 



}


