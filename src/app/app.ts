import { Component, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('BlogSiteAngularApp');
  isUserLoggedIn = signal(false);

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Check initial login state
    this.isUserLoggedIn.set(!!localStorage.getItem('userId'));

    // Listen to navigation events (including back/forward button)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Use setTimeout to ensure child component's ngOnInit runs first
      setTimeout(() => {
        this.isUserLoggedIn.set(!!localStorage.getItem('userId'));
        this.cdr.detectChanges();
      }, 0);
    });
  }

  isLoggedIn(): boolean {
    return this.isUserLoggedIn();
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
