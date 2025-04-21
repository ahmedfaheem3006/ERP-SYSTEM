// confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
  animations: [
    trigger('fadeInUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition('void => *', [
        animate('0.4s ease-out')
      ])
    ])
  ]
})
export class ConfirmationComponent implements OnInit {
  // Timer for auto-redirect (in seconds)
  redirectTimer: number = 10;
  timerInterval: any;

  constructor(private router: Router) {}

  ngOnInit() {
    // Optional: Start a countdown timer for auto-redirect
    this.startRedirectTimer();
  }

  ngOnDestroy() {
    // Clear the timer when component is destroyed
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startRedirectTimer() {
    this.timerInterval = setInterval(() => {
      this.redirectTimer--;
      if (this.redirectTimer <= 0) {
        clearInterval(this.timerInterval);
        this.redirectToLogin();
      }
    }, 1000);
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
