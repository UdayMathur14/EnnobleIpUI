import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-freight-grid-table',
  templateUrl: './freight-grid-table.component.html',
  styleUrl: './freight-grid-table.component.scss'
})

export class FreightGridTableComponent implements OnInit {
  @Input() freightList : any[] = [];
  constructor(private router: Router) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  ngOnInit(): void {
  }

  onGoToEditFreight(freightData : any) {
    this.router.navigate(['master/addEditFreight',  freightData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.freightList);
  }
}