import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ReportService } from '../../../core/service/report.service';

@Component({
  selector: 'app-debit-note-report',
  templateUrl: './debit-note-report.component.html',
  styleUrl: './debit-note-report.component.scss'
})
export class DebitNoteReportComponent {

  billTiBillReport = [];
  isFilters: boolean = true;

  constructor(
    private router: Router,
    private reportService: ReportService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit(): void {
    //this.getData();
  }

  getData(batchNumber: string = '') {

    this.reportService.getDebitNote({ batchNumber }).subscribe((res: any) => {
      this.billTiBillReport = res.billTiBillReport;
    }, error => {

    })
  }
}
