<<<<<<< HEAD
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
=======
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-vendor-grid-table',
  templateUrl: './vendor-grid-table.component.html',
  styleUrl: './vendor-grid-table.component.scss'
})
<<<<<<< HEAD
export class VendorGridTableComponent implements OnInit, OnChanges {
=======
export class VendorGridTableComponent implements OnInit {
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  @Input() vendorsList : any[] = [];
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  constructor(
    private router: Router,
  ) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vendorsList']) {
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
<<<<<<< HEAD
    debugger
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    this.exportHeader.emit(headers);
  }
  
  //NAVIGATING TO VENDOR EDIT/UDATE COMPONENT
  onGoToEditVendor(vendorData: any) {
    this.router.navigate(['master/addEditVendor', vendorData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.vendorsList);
  }
}