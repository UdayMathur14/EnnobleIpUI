import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-freight-filter',
  templateUrl: './freight-filter.component.html',
  styleUrl: './freight-filter.component.scss'
})
export class FreightFilterComponent implements OnInit {
  @Output() getData : EventEmitter<object> = new EventEmitter();
  @Input() vehcileSizes : any[] = [];
  @Input() sources : any[] =[];
  @Input() destinations : any[] =[];
<<<<<<< HEAD
  @Input() freightList : any[] =[];
  @Input() locations : any[] = [];
=======
  @Input() freightList : any[] =[]
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  freightCode : any = undefined;
  source : any = undefined;
  destination : any = undefined;
  vehicleSize : any = undefined;
<<<<<<< HEAD
  locationIds:any[]=[];
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  
  constructor(){}

  ngOnInit(): void {
  }
<<<<<<< HEAD

=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
      "source" : this.source || "",
<<<<<<< HEAD
      "vehicleSize" : this.vehicleSize || "",
      "destination" : this.destination || "",
      "locationIds":this.locationIds || []
      
=======
      "destination" : this.destination || "",
      "vehicleSize" : this.vehicleSize || ""
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    this.source = undefined;
    this.vehicleSize = undefined;
<<<<<<< HEAD
    this.destination = undefined;
    this.locationIds = [];
    let obj = {
      "freightCode" : "",
      "source" : "",
      "vehicleSize" : "",
      "destination" : "",
      "locationIds" : []
=======
    this.destination = undefined
    let obj = {
      freightCode : undefined,
      source : undefined,
      vehicleSize : undefined,
      destination : undefined
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(obj)
  }
  
}
