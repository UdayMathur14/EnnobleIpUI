import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advice-grid-table',
  templateUrl: './advice-grid-table.component.html',
  styleUrl: './advice-grid-table.component.scss'
})
export class AdviceGridTableComponent {
  constructor(private router: Router) { }

  onGoToEditAdvice() {
    this.router.navigate(['master/addEditAdvice']);
  }
}
