import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-transactionType-filter',
  templateUrl: './transactionType-filter.component.html',
  styleUrls: ['./transactionType-filter.component.scss']
})
export class TransactionTypeFilterComponent implements OnInit {
  @Input() filters : any = [];
  @Output() getData: EventEmitter<any> = new EventEmitter();
  transactionTypeCode:any = undefined;
  transactionTypeName : any = undefined;
  glCategory : any = undefined;
  status: any = undefined;

  constructor(){}
  ngOnInit() {

  }


  onTransactionTypeSearch(){
    const filterData = {
      transactionTypeCode: this.transactionTypeCode, 
      transactionTypeName: this.transactionTypeName, 
      glSubCategory : this.glCategory,
      status: this.status
    }
    this.getData.emit(filterData)
  }

  onClearFilter(){
    this.transactionTypeCode = undefined;
    this.transactionTypeName = undefined;
    this.glCategory = undefined;
    this.status = undefined;
    const filterData = {
      transactionTypeName: undefined, 
      transactionTypeCode: undefined, 
      glSubCategory : undefined,
      status: undefined
    }
    this.getData.emit(filterData)
  }
}
