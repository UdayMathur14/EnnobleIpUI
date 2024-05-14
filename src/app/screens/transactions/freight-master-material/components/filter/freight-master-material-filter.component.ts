import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-freight-master-material-filter',
  templateUrl: './freight-master-material-filter.component.html',
  styleUrl: './freight-master-material-filter.component.scss'
})
export class FreightMasterMaterialFiltersComponent implements OnInit {
  @Output() freightFilterObj : EventEmitter<object> = new EventEmitter();
  freightCode : any = undefined;
  freightList : any = [];
  
  constructor(private freightService : FreightService,
    private toastr : ToastrService){}

  ngOnInit(): void {
    this.getAllFreightsListInit();
  }

  //BINDING FREIGHT NUMBERS DROPDOWN
  getAllFreightsListInit() {
    let data = {
      "screenCode": 102, //Freight Material Screen Code
      "freightCode": '',
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
    }
    this.freightFilterObj.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    let obj = {
      freightCode : '',
    }
    this.freightFilterObj.emit(obj)
  }

}
