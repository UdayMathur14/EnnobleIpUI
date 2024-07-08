import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-approval-accounts-filter',
  templateUrl: './approval-accounts-filter.component.html',
  styleUrl: './approval-accounts-filter.component.scss'
})
export class ApprovalAccountsFiltersComponent {

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
  batchNumber: any = undefined;
  locations: any[] = APIConstant.locationsListDropdown;
  locationIds: any[] = APIConstant.locationsListDropdown.map((e: any) => (e.id));;
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
      "fromDate": this.selectedFromDate,
      "toDate": this.selectedToDate,
      locationIds: this.locationIds
    }
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter() {
    this.batchNumber = undefined;
    this.fromDate = null;
    this.biltiNumber = undefined;
    this.toDate = null;
    this.selectedFromDate = null;
    this.selectedToDate = null;
    const filterObj = {
      batchNumber: '',
      biltiNumber: '',
      locationIds: []
    }
    this.filterSearchObj.emit(filterObj)
  }
}
