import { Component } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentDate: Date = new Date();
  
  logoPath: string = 'assets/images/logo.png';


  title = 'calander';


 constructor() {}
  ngOnInit() {}

    isLoggedIn: boolean = false;

  onLoginSuccess() {
    this.isLoggedIn = true;
  }
}
