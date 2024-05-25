import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checked-materials-team-filter',
  templateUrl: './checked-materials-team-filter.component.html',
  styleUrl: './checked-materials-team-filter.component.scss'
})
export class CheckedMaterialsTeamFilterComponent {
  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;
  model!: NgbDateStruct;
  selectedFromDate: string = '';
  selectedToDate: string = '';
  batchName: any = undefined;
  biltiNumber: any = undefined;
  batchNames: string[] = [];
  batchNumber: string = '';
  @Input() filteredBiltibillList: any = [];
  @Output() filterSearchObj: EventEmitter<any> = new EventEmitter();
  today = inject(NgbCalendar).getToday();
  loadSpinner: boolean = true;
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
    console.log(this.batchNumber)
    const filterObj = {
      "biltiNumber": this.biltiNumber || "",
      "batchNumber": this.batchNumber || "",
      "fromDate": this.selectedFromDate || "2000-01-01",
      "toDate": this.selectedToDate || new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate())).slice(-2)
    }
    this.filterSearchObj.emit(filterObj)
  }

  onClearFilter(){
    this.batchNumber = '';
    this.fromDate = null,
    this.toDate = null
    const filterObj = {
      batchNumber : '',
    }
    this.filterSearchObj.emit(filterObj)
  }
}
