import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-change-bilti-status-filter',
  templateUrl: './change-bilti-status-filter.component.html',
  styleUrl: './change-bilti-status-filter.component.scss'
})
export class ChangeBiltiStatusFilterComponent {
  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;
  model!: NgbDateStruct;
  selectedFromDate: any;
  selectedToDate: any;
  batchName: any = undefined;
  biltiNumber: any = undefined;
  batchNames: string[] = [];
  today = inject(NgbCalendar).getToday();
  loadSpinner: boolean = true;
  batchNumber: string = '';
  locations: any[] = APIConstant.locationsListDropdown;
  locationIds: any[] = APIConstant.locationsListDropdown.map((e:any)=>(e.id));
  @Input() filteredBiltibillList: any = [];

  @Output() filterSearchObj: EventEmitter<any> = new EventEmitter();

  onDateSelect(type: string, e: any) {
    const month = Number(e.month) < 10 ? '0' + e.month : e.month;
    const day = Number(e.day) < 10 ? '0' + e.day : e.day;
    if (type === 'fromDate') {
      this.selectedFromDate = e.year + '-' + month.toString() + '-' + day.toString();
    } else {
      this.selectedToDate = e.year + '-' + month.toString() + '-' + day.toString();
    }
  }


  handleSearch() {
    const filterObj = {
      "biltiNumber": this.biltiNumber || "",
      "batchNumber": this.batchNumber || "",
      "fromDate": this.selectedFromDate,
      "toDate": this.selectedToDate,
      locationIds: this.locationIds
    }
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter(){
    this.batchNumber = '';
    this.fromDate = null,
    this.toDate = null,
    this.biltiNumber = '';
    this.selectedFromDate = null;
    this.selectedToDate = null;
    const filterObj = {
      batchNumber : '',
      biltiNumber : '',
      locationIds: []
    }
    this.filterSearchObj.emit(filterObj)
  }
}
