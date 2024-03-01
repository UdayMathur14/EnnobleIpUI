import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-advice',
  templateUrl: './add-edit-advice.component.html',
  styleUrl: './add-edit-advice.component.scss'
})
export class AddEditAdviceComponent {
  constructor(private router: Router) { }

  onCancelPress() {
    this.router.navigate(['/master/advice'])
  }
}
