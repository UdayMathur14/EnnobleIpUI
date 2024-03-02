import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freight-grid-table',
  templateUrl: './freight-grid-table.component.html',
  styleUrl: './freight-grid-table.component.scss'
})
export class FreightGridTableComponent {
  constructor(private router: Router) {}
  onEditFreight(){
    this.router.navigate(['master/addEditFreight']);
  }
}
