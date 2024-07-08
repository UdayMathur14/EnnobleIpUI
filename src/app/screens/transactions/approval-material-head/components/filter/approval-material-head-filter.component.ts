import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-approval-material-head-filter',
  templateUrl: './approval-material-head-filter.component.html',
  styleUrl: './approval-material-head-filter.component.scss'
})
export class ApprovalMaterialHeadFilterComponent {
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
  locations:any[] = APIConstant.locationsListDropdown;
  locationIds:any[] = APIConstant.locationsListDropdown.map((e: any) => (e.id));;
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
      "fromDate": this.selectedFromDate,
      "toDate": this.selectedToDate,
      locationIds:this.locationIds
    }
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter(){
    this.batchNumber = '';
    this.fromDate = null;
    this.toDate = null;
    this.selectedFromDate = null;
    this.selectedToDate = null;
    const filterObj = {
      batchNumber : '',
      locationIds:[]
    }
    this.filterSearchObj.emit(filterObj)
  }
}
