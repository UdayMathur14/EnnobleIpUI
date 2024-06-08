import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AdviceTypeService } from '../../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-advice-grid-table',
  templateUrl: './advice-grid-table.component.html',
  styleUrl: './advice-grid-table.component.scss'
})
export class AdviceGridTableComponent implements OnInit {
  @Input() advicesList: any = [];
  @Input() filterKeyword!: string;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onGoToEditAdvice(advice : any) {
    this.router.navigate(['master/addEditAdvice', advice.id]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.advicesList);
  }
}
