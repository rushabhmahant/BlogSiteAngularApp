import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Clear login state when home page loads
    localStorage.removeItem('userId');
  }

  exploreArticles(): void {
    this.router.navigate(['/explore-blogs']);
  }

}
