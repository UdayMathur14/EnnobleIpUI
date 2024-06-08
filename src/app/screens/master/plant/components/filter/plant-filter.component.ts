import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './plant-filter.component.html',
  styleUrls: ['./plant-filter.component.scss']
})
export class PlantFilterComponent implements OnInit {
  @Input() plantsList : any[] = [];
  @Input() cities : any[] = [];
  @Input() states : any[] = [];
  @Output() getData: EventEmitter<any> = new EventEmitter();
  plantCode:any = undefined;
  stateCode : any = undefined;
  cityCode : any = undefined;
  auCode : any;
  siteCode : any;

  constructor(){}
  ngOnInit() {

  }

  onPlantSearch(){
    const filterData = {
      plantCode: this.plantCode, 
      city: this.cityCode, 
      state : this.stateCode, 
      auCode : this.auCode, 
      siteCode : this.siteCode
    }
    this.getData.emit(filterData)
  }

  onClearFilter(){
    this.plantCode = undefined;
    this.cityCode = undefined
    this.stateCode = undefined
    this.auCode = undefined
    this.siteCode = undefined;

    const filterData = {
      plantCode: undefined, 
      city: undefined, 
      state : undefined, 
      auCode : undefined, 
      siteCode : undefined
    }
    this.getData.emit(filterData)
  }
}
