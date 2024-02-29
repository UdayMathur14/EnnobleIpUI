import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {
  constructor(private router : Router){}

  isFilters : boolean = false;

  ngOnInit() { }

  onCreatePlant(){
    this.router.navigate(['master/addEditPlant'])
  }

}
