import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';

@Component({
  selector: 'app-point-charge',
  templateUrl: './point-charge.component.html',
  styleUrls: ['./point-charge.component.scss']
})
export class PointChargeComponent implements OnInit {
  constructor(private router : Router,private plantService:PlantService){}

  isFilters : boolean = false;

  ngOnInit() { 
    this.getData();
  }

  getData(){
    this.plantService.get().subscribe(res=>{

    })
  }

  onCreatePointCharge(){
    this.router.navigate(['master/addEditPointCharge'])
  }

}
