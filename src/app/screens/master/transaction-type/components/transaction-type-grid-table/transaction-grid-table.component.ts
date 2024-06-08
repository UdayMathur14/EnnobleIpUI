import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionTypeListModel } from '../../../../../core/model/masterModels.model';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-transaction-grid-table',
  templateUrl: './transaction-grid-table.component.html',
  styleUrl: './transaction-grid-table.component.scss'
})
export class TransactionGridTableComponent implements OnInit{
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  @Input() transactionTypesList : any[] = [];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loadSpinner : boolean = true;
  constructor(private router : Router,
    ){}

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactionTypesList']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table.nativeElement.querySelectorAll('thead th');
    headerCells.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Actions') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }

  onGoToEditTransaction(transactionData: TransactionTypeListModel) {
    this.router.navigate(['master/addEditTransactionTypes', transactionData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.transactionTypesList);
  }
}