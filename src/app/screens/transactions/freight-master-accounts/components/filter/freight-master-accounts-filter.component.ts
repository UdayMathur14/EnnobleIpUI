import { Component, EventEmitter, Output } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-freight-master-accounts-filter',
  templateUrl: './freight-master-accounts-filter.component.html',
  styleUrl: './freight-master-accounts-filter.component.scss'
})
export class FreightMasterAccountsFiltersComponent {
  @Output() freightFilterObj: EventEmitter<object> = new EventEmitter();
  freightCode: any = undefined;
  filters: any = [];
  locations:any[] = APIConstant.commonLocationsList;
  locationIds:any[]= APIConstant.commonLocationsList.map((e:any)=>(e.id));

  constructor(private freightService: FreightService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAllFreightsListInit();
  }

  //BINDING FREIGHT NUMBERS DROPDOWN
  getAllFreightsListInit() {
    let data = {
      "screenCode": 103, //Freight Account Screen Code
      "freightCode": '',
      locationIds:[]
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.filters = response.filters;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    })
  }

  onFreightSearch() {
    let obj = {
      "freightCode": this.freightCode || "",
      locationIds: this.locationIds
    }
    this.freightFilterObj.emit(obj)
  }

  onClearFilter() {
    this.freightCode = undefined;
    this.locationIds = this.locationIds;
    let obj = {
      freightCode: '',
      locationIds: this.locationIds
    }
    this.freightFilterObj.emit(obj)
  }

}
