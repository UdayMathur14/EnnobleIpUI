import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-transactionType-filter',
  templateUrl: './transactionType-filter.component.html',
  styleUrls: ['./transactionType-filter.component.scss']
})
export class TransactionTypeFilterComponent implements OnInit {
  @Input() transactionTypesList : any[] = [];
  @Output() getData: EventEmitter<any> = new EventEmitter();
  transactionTypeCode:any = undefined;
  transactionTypeName : any = undefined;
  glCategory : any = undefined;

  constructor(){}
  ngOnInit() {

  }

  onTransactionTypeSearch(){
    const filterData = {
      transactionTypeCode: this.transactionTypeCode, 
      transactionTypeName: this.transactionTypeName, 
      glSubCategory : this.glCategory
    }
    this.getData.emit(filterData)
  }

  onClearFilter(){
    this.transactionTypeCode = undefined;
    this.transactionTypeName = undefined;
    this.glCategory = undefined;
    const filterData = {
      transactionTypeName: undefined, 
      transactionTypeCode: undefined, 
      glSubCategory : undefined
    }
    this.getData.emit(filterData)
  }
}
