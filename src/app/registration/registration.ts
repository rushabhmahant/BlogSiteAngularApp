import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../services/user-service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {

  registrationForm: FormGroup;

  username!: string;
  email!: string;
  password!: string;
  confirmPassword!: string;

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required,
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  ngOnInit(): void {
    // Clear login state when registration page loads
    localStorage.removeItem('userId');
  }

  onSubmit() {
    if(this.registrationForm.get('password')?.value !== this.registrationForm.get('confirmPassword')?.value) {
      alert("Passwords do not match.");
      return;
    }
    if (this.registrationForm.valid) {
      this.username = this.registrationForm.get('username')?.value;
      this.email = this.registrationForm.get('email')?.value;
      this.password = this.registrationForm.get('password')?.value;
      this.confirmPassword = this.registrationForm.get('confirmPassword')?.value;
      
      const user: User = {
        userId: '',  
        userName: this.username,
        userEmailId: this.email,  
        userPassword: this.password
      };

      this.userService.registerUser(user).subscribe(
        data => {
          console.log("User registered successfully!");
          alert("User registered successfully!");
          this.router.navigate(['/login']);
        },
        error => {
          console.log("Error ocurred while login: ");
          console.log(error);
          alert("Registration failed. Please try again.");
        }
      );
    } else {
      // Mark all fields as touched to show validation errors
      this.registrationForm.markAllAsTouched();
    }
  }

}
