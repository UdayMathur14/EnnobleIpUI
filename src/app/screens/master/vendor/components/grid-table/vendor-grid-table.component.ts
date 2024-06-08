import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-vendor-grid-table',
  templateUrl: './vendor-grid-table.component.html',
  styleUrl: './vendor-grid-table.component.scss'
})
export class VendorGridTableComponent implements OnInit {
  @Input() vendorsList : any[] = [];
  constructor(
    private router: Router,
  ) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  ngOnInit(): void {
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