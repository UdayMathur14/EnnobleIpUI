import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionTypesService } from '../../../../../core/service/transactionTypes.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTypeListModel } from '../../../../../core/model/masterModels.model';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-transaction-grid-table',
  templateUrl: './transaction-grid-table.component.html',
  styleUrl: './transaction-grid-table.component.scss'
})
export class TransactionGridTableComponent implements OnInit {
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  transactionTypesList: TransactionTypeListModel[] = [];
  transactionTypesListOrg: TransactionTypeListModel[] = [];
  loadSpinner: boolean = true;
  @Input() filterKeyword!: string;
  @Output() dataChange = new EventEmitter<any[]>();
  @Output() headersChange = new EventEmitter<string[]>();
  @ViewChild('table') table!: ElementRef;

  constructor(private router: Router,
    private transactionTypesService: TransactionTypesService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllTransactionTypes()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.transactionTypesListOrg && this.transactionTypesListOrg.length && changes['filterKeyword'].currentValue) {
      this.transactionTypesList = this.transactionTypesListOrg.filter((e: any) => e.code.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if (this.transactionTypesListOrg && this.transactionTypesListOrg.length && !changes['filterKeyword'].currentValue) {
      this.transactionTypesList = this.transactionTypesListOrg;
    }
    this.dataChange.emit(this.transactionTypesList);
  }

  getAllTransactionTypes() {
    let data = {
      "code": ''
    }
    this.transactionTypesService.getTransactionTypes(data).subscribe((response: any) => {
      this.transactionTypesList = response.transactionTypes;
      this.transactionTypesListOrg = response.transactionTypes;
      this.loadSpinner = false;
      this.dataChange.emit(this.transactionTypesList);
      this.emitHeaders();
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table.nativeElement.querySelectorAll('thead th');
    headerCells.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Action') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.headersChange.emit(headers);
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