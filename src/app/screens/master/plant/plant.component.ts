import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {
  constructor(private router : Router,private plantService:PlantService){}

  isFilters : boolean = false;

  ngOnInit() { 
    this.getData();
  }

  getData(){
    this.plantService.get().subscribe(res=>{

    })
  }

  onCreatePlant(){
    this.router.navigate(['master/addEditPlant'])
  }

}
