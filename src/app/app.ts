import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('BlogSiteAngularApp');

  constructor(private router: Router) {}


  goToRegisterPage(){
    // this.showLoginButton = true;
    // this.showSignupButton = true;
    // this.showLogoutButton = false;
    // this.logout()
    this.router.navigate(['register']);
  }

  goToLoginPage(){
    // this.showLoginButton = true;
    // this.showSignupButton = true;
    // this.showLogoutButton = false;
    // this.logout()
    this.router.navigate(['login']);
  }

  goToHomePage(){
    this.router.navigate(['home']);
  }

}
