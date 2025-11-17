import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  ngOnInit(): void {
    // Clear login state when home page loads
    localStorage.removeItem('userId');
  }

}
