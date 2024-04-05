import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrl: './transporter.component.scss'
})
export class TransporterComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

  onCreateTransporter(){
    this.router.navigate(['master/addEditTransporter'])
  }

}
