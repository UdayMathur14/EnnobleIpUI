import { Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bilti-bill-process-view-filter',
  templateUrl: './bilti-bill-process-view-filter.component.html',
  styleUrl: './bilti-bill-process-view-filter.component.scss'
})
export class BiltiBillProcessViewFilterComponent {
  fromDate!: NgbDateStruct;
  toDate!: NgbDateStruct;
  model!: NgbDateStruct;
  selectedFromDate: string = '';
  selectedToDate: string = '';
  batchName: any = undefined;
  biltiNumber: any = undefined;
  batchNames: string[] = [];
  today = inject(NgbCalendar).getToday();
  loadSpinner: boolean = true;
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
    const batchNameValue = this.batchNameInput ? this.batchNameInput.nativeElement.value : '';
    const filterObj = {
      "biltiNumber": this.biltiNumber || "",
      "batchNumber": batchNameValue || "",
      "fromDate": this.selectedFromDate || "2000-01-01",
      "toDate": this.selectedToDate || new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate())).slice(-2)
    }
    this.filterSearchObj.emit(filterObj)
  }
}
