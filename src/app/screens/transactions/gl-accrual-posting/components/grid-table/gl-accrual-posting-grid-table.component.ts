import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gl-accrual-posting-grid-table',
  templateUrl: './gl-accrual-posting-grid-table.component.html',
  styleUrl: './gl-accrual-posting-grid-table.component.scss'
})
export class GlAccrualPostingGridTableComponent {

  @Input() glAccrualList: any[] = [];

}
