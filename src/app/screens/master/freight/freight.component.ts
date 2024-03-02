import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;

  onCreateFreight(){
    this.router.navigate(['master/addEditFreight'])
  }
} 
