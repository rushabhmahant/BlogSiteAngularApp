import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../services/user-service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  loginForm: FormGroup;

  username!: string;
  password!: string;
  user!: User;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  ngOnInit(): void {
    // Clear login state when login page loads
    localStorage.removeItem('userId');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Login form submitted:', formData);
      this.username = this.loginForm.get('email')?.value;
      this.password = this.loginForm.get('password')?.value;
      
      const user: User = {
        userId: '',  
        userName: '',
        userEmailId: this.username,  
        userPassword: this.password
      };

      this.userService.loginUser(user).subscribe(
        data => {
          console.log("User successfully logged in.");
          // Store userId in localStorage
          localStorage.setItem('userId', data.userId);
          this.router.navigate(['/blog-list', data.userId]);
        },
        error => {
          console.log("Error ocurred while login: ");
          console.log(error);
          if(error.status === 404) {
            alert("Invalid credentials. Please try again.");
          }
          else {
            alert("Login failed. Please try again.");
        }
      }
      );

    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

}
