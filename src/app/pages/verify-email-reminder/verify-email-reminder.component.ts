import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-email-reminder',
  templateUrl: './verify-email-reminder.component.html',
  styleUrls: ['./verify-email-reminder.component.css']
})
export class VerifyEmailReminderComponent implements OnInit {

  constructor() { }

  @Input() days = 0;
  @Input() show = false;

  ngOnInit(): void {

  }

}
