import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TransporterService } from '../../../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-transporter-grid-table',
  templateUrl: './transporter-grid-table.component.html',
  styleUrl: './transporter-grid-table.component.scss'
})
export class TransporterGridTableComponent implements OnInit {
  @Input() transportersList: any = [];
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onGoToEditTransporter(transporterId: any) {
    this.router.navigate(['master/addEditTransporter', transporterId]);
  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.transportersList);
  }

}