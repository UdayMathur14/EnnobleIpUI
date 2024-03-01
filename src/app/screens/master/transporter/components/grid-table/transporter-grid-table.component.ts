import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transporter-grid-table',
  templateUrl: './transporter-grid-table.component.html',
  styleUrl: './transporter-grid-table.component.scss'
})
export class TransporterGridTableComponent {
  constructor(private router: Router) {}

  onGoToEditTransporter(){
    this.router.navigate(['master/addEditTransporter']);
  }

}