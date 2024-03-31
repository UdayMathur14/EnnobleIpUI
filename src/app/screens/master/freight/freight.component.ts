import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent {
  isFilters : boolean = true;
  searchedFreight : any;
  
  constructor(private router : Router){}

  //HOLDING SEARCHED VALUE FROM FILTERS
  searchFreightCode(event : any){
    this.searchedFreight = event;
  }

  //FUNCTION TO REDIRECT USER ON FREIGHT CREATION SCREEN
  onCreateFreight(){
    this.router.navigate(['master/addEditFreight', '0'])
  }
} 
