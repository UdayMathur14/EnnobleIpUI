import { Component, EventEmitter, Output } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-freight-master-accounts-filter',
  templateUrl: './freight-master-accounts-filter.component.html',
  styleUrl: './freight-master-accounts-filter.component.scss'
})
export class FreightMasterAccountsFiltersComponent {
  @Output() freightFilterObj: EventEmitter<object> = new EventEmitter();
  freightCode: any = undefined;
  freightList: any = [];

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
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
    })
  }

  onFreightSearch() {
    let obj = {
      "freightCode": this.freightCode || "",
    }
    this.freightFilterObj.emit(obj)
  }

  onClearFilter() {
    this.freightCode = undefined;
    let obj = {
      freightCode: '',
    }
    this.freightFilterObj.emit(obj)
  }

}
