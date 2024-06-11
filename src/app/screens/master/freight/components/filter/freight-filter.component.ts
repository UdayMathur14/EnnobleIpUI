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
  @Input() freightList : any[] =[];
  @Input() locations : any[] = [];
  freightCode : any = undefined;
  source : any = undefined;
  destination : any = undefined;
  vehicleSize : any = undefined;
  locationIds:any[]=[];
  
  constructor(){}

  ngOnInit(): void {
  }


  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
      "source" : this.source || "",
      "vehicleSize" : this.vehicleSize || "",
      "destination" : this.destination || "",
      "locationIds":this.locationIds || []
      
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    this.source = undefined;
    this.vehicleSize = undefined;
    this.destination = undefined;
    this.locationIds = [];
    let obj = {
      "freightCode" : "",
      "source" : "",
      "vehicleSize" : "",
      "destination" : "",
      "locationIds" : []
    }
    this.getData.emit(obj)
  }
  
}
