import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BlogSiteAngularApp');

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  goToRegisterPage(){
    this.router.navigate(['register']);
  }

  goToLoginPage(){
    this.router.navigate(['login']);
  }

  goToHomePage(){
    this.router.navigate(['home']);
  }

  goToBlogList(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/blog-list', userId]);
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userId');
      this.router.navigate(['/login']);
    }
  }

}
