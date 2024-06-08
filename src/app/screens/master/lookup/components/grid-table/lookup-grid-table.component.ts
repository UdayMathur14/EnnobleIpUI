import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-lookup-grid-table',
  templateUrl: './lookup-grid-table.component.html',
  styleUrl: './lookup-grid-table.component.scss'
})
export class LookupGridTableComponent implements OnInit {

  @Input() lookupsList : any[] = [];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onGoToEditLookup(lookupData: any) {
    this.router.navigate(['master/addEditLookup', lookupData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.lookupsList);
  }

}
