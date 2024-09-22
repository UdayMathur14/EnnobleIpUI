import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gl-accrual-posting-filters',
  templateUrl: './gl-accrual-posting-filters.component.html',
  styleUrl: './gl-accrual-posting-filters.component.scss'
})
export class GlAccrualPostingFiltersComponent {
  @Output() getData: EventEmitter<any> = new EventEmitter();

  batchId: any = undefined;
  costCenter: any = undefined;
  businessArea: any = undefined;
  glAccount: any = undefined;
  subCategory: any = undefined;
  @Input() filters: any = [];

  constructor() { }

  handleSearch() {
    this.getData.emit({ 
      batchNumber: this.batchId,
      costCenter: this.costCenter,
      businessArea: this.businessArea,
      glAccount: this.glAccount,
      subCategory: this.subCategory
    })
  }

  onClearFilter() {
   this.batchId = '',
   this.costCenter = '',
   this.businessArea = '',
   this.glAccount = '',
   this.subCategory = ''
    this.getData.emit({ 
      batchNumber: '' ,
      costCenter: '',
      businessArea: '',
      glAccount: '',
      subCategory: ''
    })
  }
}
