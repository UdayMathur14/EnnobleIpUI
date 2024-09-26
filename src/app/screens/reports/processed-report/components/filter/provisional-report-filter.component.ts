import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'app-provisional-report-filter',
  templateUrl: './provisional-report-filter.component.html',
  styleUrl: './provisional-report-filter.component.scss'
})
export class ProvisionalReportFilterComponent {

  @Output() exportData: EventEmitter<any> = new EventEmitter();
 
  @Output() getData: EventEmitter<any> = new EventEmitter();

  costCenter: any = undefined;
  businessArea: any = undefined;
  glAccount: any = undefined;
  subCategory: any = undefined;
  @Input() filters: any = [];

  constructor() { }

  handleSearch() {
    this.getData.emit({ 
      costCenter: this.costCenter,
      businessArea: this.businessArea,
      glAccount: this.glAccount,
      subCategory: this.subCategory
    })
  }

  onClearFilter() {
   this.costCenter = '',
   this.businessArea = '',
   this.glAccount = '',
   this.subCategory = ''
    this.getData.emit({ 
      costCenter: '',
      businessArea: '',
      glAccount: '',
      subCategory: ''
    })
  }
}
