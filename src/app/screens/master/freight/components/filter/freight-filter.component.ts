import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';

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
  @Input() freightList : any[] =[]
  freightCode : any = undefined;
  source : any = undefined;
  destination : any = undefined;
  vehicleSize : any = undefined;
  
  constructor(){}

  ngOnInit(): void {
  }

  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
      "source" : this.source || "",
      "destination" : this.destination || "",
      "vehicleSize" : this.vehicleSize || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    this.source = undefined;
    this.vehicleSize = undefined;
    this.destination = undefined
    let obj = {
      freightCode : undefined,
      source : undefined,
      vehicleSize : undefined,
      destination : undefined
    }
    this.getData.emit(obj)
  }
  
}
