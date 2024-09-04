import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-rejection-bilti-detail-report-filter',
  templateUrl: './rejection-bilti-detail-report-filter.component.html',
  styleUrl: './rejection-bilti-detail-report-filter.component.scss'
})
export class RejectionBiltiDetailReportFilterComponent implements OnInit {
  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;
  model!: NgbDateStruct;
  selectedFromDate: string = '';
  selectedToDate: string = '';
  batchName: any = undefined;
  biltiNumber: any = undefined;
  batchNames: string[] = [];
  today = inject(NgbCalendar).getToday();
  loadSpinner: boolean = true;
  batchNumber: any = undefined;
  locationIds:any[]= APIConstant.commonLocationsList.map((e:any)=>(e.id));
  locations:any[] = APIConstant.commonLocationsList;
  status: any = undefined;
  @Output() exportData: EventEmitter<any> = new EventEmitter();

  @Input() filters: any = [];
  @ViewChild('batchNameInput') batchNameInput!: ElementRef<HTMLInputElement>;

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
      "fromDate": this.selectedFromDate || "2000-01-01",
      "toDate": this.selectedToDate || new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate())).slice(-2),
      locationIds: this.locationIds,
      status: this.status || ""
    }
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter(){
    this.batchNumber = undefined;
    this.fromDate = null,
    this.toDate = null,
    this.biltiNumber = undefined;
    this.locationIds = this.locationIds;
    this.status = undefined
    const filterObj = {
      batchNumber : '',
      biltiNumber: '',
      locationIds:this.locationIds,
      status: ''
    }
    this.filterSearchObj.emit(filterObj)
  }
}
