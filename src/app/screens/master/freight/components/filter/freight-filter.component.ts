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
  @Input() filters : any =[];
  @Input() locations : any[] = [];
  freightCode : any = undefined;
  source : any = undefined;
  destination : any = undefined;
  vehicleSize : any = undefined;
  status: any = undefined;
  locationIds:any[] = APIConstant.commonLocationsList.map((e: any) => (e.id));;
  
  constructor(){}

  ngOnInit(): void {
  }

  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
      "source" : this.source || "",
      "vehicleSize" : this.vehicleSize || "",
      "destination" : this.destination || "",
      "locationIds":this.locationIds || [],
      "status": this.status || ""
      
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    this.source = undefined;
    this.vehicleSize = undefined;
    this.destination = undefined;
    this.locationIds = this.locationIds;
    this.status = undefined;
    let obj = {
      "freightCode" : "",
      "source" : "",
      "vehicleSize" : "",
      "destination" : "",
      "locationIds" : this.locationIds,
      "status": ""
    }
    this.getData.emit(obj)
  }
  
}
