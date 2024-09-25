import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-freight-master-material-filter',
  templateUrl: './freight-master-material-filter.component.html',
  styleUrl: './freight-master-material-filter.component.scss'
})
export class FreightMasterMaterialFiltersComponent implements OnInit {
  @Output() freightFilterObj : EventEmitter<object> = new EventEmitter();
  freightCode : any = undefined;
  filters : any = [];
  commonLocations: any = [];
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id))
  locations : any[] = APIConstant.commonLocationsList;
  
  constructor(private freightService : FreightService,
    private toastr : ToastrService, private lookupService: LookupService){}

  ngOnInit(): void {
    this.getAllFreightsListInit();
  }

  //BINDING FREIGHT NUMBERS DROPDOWN
  getAllFreightsListInit() {
    let data = {
      "screenCode": 102, //Freight Material Screen Code
      "freightCode": '',
      locationIds:[]
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.filters = response.filters;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    })
  }

  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
      locationIds: this.locationIds
    }
    this.freightFilterObj.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    this.locationIds = this.locationIds;
    let obj = {
      freightCode : '',
      locationIds: this.locationIds
    }
    this.freightFilterObj.emit(obj)
  }

}
