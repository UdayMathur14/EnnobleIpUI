import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-point-charge-grid-table',
  templateUrl: './point-charge-grid-table.component.html',
  styleUrl: './point-charge-grid-table.component.scss'
})
export class PointChargeGridTableComponent implements OnInit {
  @Input() pointChargesList : any[] = [];
  constructor(
    private router: Router,
  ) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
  }

  // NAVIGATING TO EDIT POINT MASTER PAGE
  onEditPointCharge(pointChargeData: any) {
    this.router.navigate(['master/editPointCharge', pointChargeData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.pointChargesList);
  }
}

