import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-freight-filter',
  templateUrl: './freight-filter.component.html',
  styleUrl: './freight-filter.component.scss'
})
export class FreightFilterComponent implements OnInit {
  @Output() freightFilterObj : EventEmitter<object> = new EventEmitter();
  freightCode : any = undefined;
  source : any = undefined;
  vehicleSize : any = undefined;
  freightList : any = [];
  sources: any = [];
  vehcileSizes: any = [];
  
  constructor(private freightService : FreightService,
    private toastr : ToastrService){}

  ngOnInit(): void {
    this.getAllFreightsListInit();
    this.getSourceDropdownData();
    this.getVehicleSizeDropdownData();
  }

  //BINDING FREIGHT NUMBERS DROPDOWN
  getAllFreightsListInit() {
    let data = {
      "freightCode": '',
      "source": '',
      "vehicleSize": ''
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
      "source" : this.source || "",
      "vehicleSize" : this.vehicleSize || ""
    }
    this.freightFilterObj.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    this.source = '';
    this.vehicleSize = '';
    let obj = {
      freightCode : '',
      source : '',
      vehicleSize : ''
    }
    this.freightFilterObj.emit(obj)
  }

  getSourceDropdownData(){
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'Source'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.sources = res.lookUps
    })
  }

  getVehicleSizeDropdownData(){
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'VehicleSize'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.vehcileSizes = res.lookUps
    })
  }
  
}
