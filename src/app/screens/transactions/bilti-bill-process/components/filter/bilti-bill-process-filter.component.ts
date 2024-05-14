import { Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AdviceTypeService } from '../../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bilti-bill-process-filter',
  templateUrl: './bilti-bill-process-filter.component.html',
  styleUrl: './bilti-bill-process-filter.component.scss'
})
export class BiltiBillProcessFilterComponent {
  fromDate!: NgbDateStruct;
  toDate!: NgbDateStruct;
  model!: NgbDateStruct;
  selectedFromDate: string = '';
  selectedToDate: string = '';
  adviceType: any = undefined;
  batchName: any = undefined;
  biltiNumber: any = undefined;
  batchNames: string[] = [];
  today = inject(NgbCalendar).getToday();
  // maxDate : {year:new Date().getFullYear(),month: new Date().getMonth(), day: new Date().getDate()}
  loadSpinner: boolean = true;
  adviceTypeList: any = [];
  @ViewChild('batchNameInput') batchNameInput!: ElementRef<HTMLInputElement>;

  @Output() filterSearchObj: EventEmitter<any> = new EventEmitter();
  constructor(
    private adviceService: AdviceTypeService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAllAdviceTypesListInit();
  }

  getAllAdviceTypesListInit() {
    let data = {
      "adviceType": '',
    }
    this.adviceService.getAdviceTypes(data).subscribe((response: any) => {
      this.adviceTypeList = response.advices;
      console.log(this.adviceTypeList, "this.adviceTypeList");
      // Populate batch names related to advice types
      this.batchNames = this.adviceTypeList.map((advice: any) => advice.batchName);

      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onAdviceTypeSelect(selectedAdvice: any) {
    const adviceType = selectedAdvice.$ngOptionLabel; // Extract advice type from $ngOptionLabel
    console.log('Advice Type Selected:', adviceType);
    console.log('Advice Type List:', this.adviceTypeList);

    const matchedAdvice = this.adviceTypeList.find((advice: any) => advice.adviceType.trim() === adviceType.trim());
    console.log('Selected Advice:', matchedAdvice);

    if (!matchedAdvice) {
      console.log('No advice found for the selected type:', adviceType);
    }

    if (matchedAdvice && this.batchNameInput && this.batchNameInput.nativeElement) {
      console.log('Updating Batch Name:', matchedAdvice.batchName);
      // Update batch name input field using property binding
      this.batchNameInput.nativeElement.value = matchedAdvice.batchName;
    }
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
      // "plantCode": this.plantCode || "",
      // "transactionTypeId": this.transactionTypeId || 0,
      "biltiNumber": this.biltiNumber || 0,
      "batchName": this.batchName || "",
      "fromDate": this.selectedFromDate || "2000-01-01",
      "toDate": this.selectedToDate || new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate())).slice(-2)
    }
    this.filterSearchObj.emit(filterObj)
  }
}
