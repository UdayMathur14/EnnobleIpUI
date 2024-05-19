import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-transaction-type',
  templateUrl: './transaction-type.component.html',
  styleUrls: ['./transaction-type.component.scss']
})
export class TransactionTypeComponent implements OnInit {

  isFilters: boolean = false;
  filterKeyword: string = '';
  fullScreen : boolean = false;
  constructor(private router: Router,
    private exportService: ExportService
  ) { }


  ngOnInit() { }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  exportData(fileName: string = "Transaction Type") {
    this.exportService.csvExport(fileName);
  }
}
