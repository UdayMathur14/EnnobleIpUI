import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-part-grid-table',
  templateUrl: './part-grid-table.component.html',
  styleUrl: './part-grid-table.component.scss'
})
export class PartGridTableComponent {
  constructor(private router: Router) {}

  onGoToEditPart(){
    this.router.navigate(['master/addEditPart']);
  }

}