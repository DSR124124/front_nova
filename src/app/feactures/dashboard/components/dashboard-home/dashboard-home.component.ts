import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css'],
  standalone: false
})
export class DashboardHomeComponent {
  currentTime = new Date();
  
  constructor() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
}
