import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PartService } from '../../../../../core/service/part.service';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-part-grid-table',
  templateUrl: './part-grid-table.component.html',
  styleUrl: './part-grid-table.component.scss'
})
export class PartGridTableComponent implements OnInit {
  @Input() partsList : any[] = [];
  constructor(private router: Router) { }
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  ngOnInit(): void {
  }

  onGoToEditPart(partData : any) {
    this.router.navigate(['master/addEditPart',  partData.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.partsList);
  }
}