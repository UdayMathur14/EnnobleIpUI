import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-bilti-bill-process-view-filter',
  templateUrl: './bilti-bill-process-view-filter.component.html',
  styleUrl: './bilti-bill-process-view-filter.component.scss'
})
export class BiltiBillProcessViewFilterComponent implements OnInit {
  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;
  model!: NgbDateStruct;
  selectedFromDate: any;
  selectedToDate: any;
  batchName: any = undefined;
  biltiNumber: any = undefined;
  today = inject(NgbCalendar).getToday();
  loadSpinner: boolean = true;
  batchNumber: any = undefined;
  locationIds:any[]= APIConstant.locationsListDropdown.map((e:any)=>(e.id));
  locations:any[] = APIConstant.locationsListDropdown;
  adviceType: any = undefined;
  status: any = undefined;
  @Input() filters: any = [];
  @Output() filterSearchObj: EventEmitter<any> = new EventEmitter();
  constructor(
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    
  }

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
      "batchName": this.batchName || "",
      "fromDate": this.selectedFromDate,
      "toDate": this.selectedToDate,
      locationIds: this.locationIds,
      "adviceType": this.adviceType || "",
      "status": this.status || ""
    }
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter(){
    this.batchNumber = undefined;
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.fromDate = null;
    this.toDate = null;
    this.biltiNumber = undefined;
    this.batchName = undefined;
    this.adviceType = undefined;
    this.status = undefined;
    this.locationIds = [];
    const filterObj = {
      batchNumber : '',
      biltiNumber: '',
      batchaname: '',
      adviceType: '',
      status: '',
      locationIds: []
    }
    this.filterSearchObj.emit(filterObj)
  }
}
