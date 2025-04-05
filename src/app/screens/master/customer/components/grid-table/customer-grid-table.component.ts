import { Component, OnInit, Input, SimpleChanges, EventEmitter, ElementRef, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../../../core/service/customer.service';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-customer-grid-table',
  templateUrl: './customer-grid-table.component.html',
  styleUrl: './customer-grid-table.component.scss'
})
export class CustomerGridTableComponent implements OnInit {
  @Input() customersList : any[] = [];
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  constructor(private router: Router) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
    
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customersList']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Action') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }

  onGoToEditCustomer(customerData : any) {
    this.router.navigate(['master/addEditCustomer',  customerData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.customersList);
  }
}