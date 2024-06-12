import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './plant-filter.component.html',
  styleUrls: ['./plant-filter.component.scss']
})
export class PlantFilterComponent implements OnInit {
<<<<<<< HEAD
  @Input() locations : any[] = [];
  @Input() plantsList : any[] = [];
  @Input() cities : any[] = [];
  @Input() states : any[] = [];
  locationIds : any = [];
=======
  @Input() plantsList : any[] = [];
  @Input() cities : any[] = [];
  @Input() states : any[] = [];
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  @Output() getData: EventEmitter<any> = new EventEmitter();
  plantCode:any = undefined;
  stateCode : any = undefined;
  cityCode : any = undefined;
  auCode : any;
  siteCode : any;
<<<<<<< HEAD
=======

  constructor(){}
  ngOnInit() {
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

  }

  onPlantSearch(){
<<<<<<< HEAD
    debugger
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    const filterData = {
      plantCode: this.plantCode, 
      city: this.cityCode, 
      state : this.stateCode, 
      auCode : this.auCode, 
<<<<<<< HEAD
      siteCode : this.siteCode,
      locations : this.locationIds
=======
      siteCode : this.siteCode
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(filterData)
  }

  onClearFilter(){
    this.plantCode = undefined;
    this.cityCode = undefined
    this.stateCode = undefined
    this.auCode = undefined
    this.siteCode = undefined;
<<<<<<< HEAD
    this.locationIds = [];
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

    const filterData = {
      plantCode: undefined, 
      city: undefined, 
      state : undefined, 
      auCode : undefined, 
<<<<<<< HEAD
      siteCode : undefined,
      locations : []
    }
    this.getData.emit(filterData)
  }

=======
      siteCode : undefined
    }
    this.getData.emit(filterData)
  }
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
}
