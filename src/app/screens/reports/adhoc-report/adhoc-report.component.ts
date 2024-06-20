import { Component, OnInit } from '@angular/core';
import { AdhocReportService } from '../../../core/service/adhocReport.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-adhoc-report',
  templateUrl: './adhoc-report.component.html',
  styleUrl: './adhoc-report.component.scss'
})
export class AdhocReportComponent implements OnInit {
  loadSpinner: boolean = true;
  colFiltersData: any[] = [];
  columnsList: any[] = [];
  filtersList: any[] = [];
  reportFilters: any[] = [];
  selectedColumns: any[] = [];
  highlightedLeftColumn: any = {};
  highlightedRightColumn: any = {};
  highlightedLeftIndex: number = 0;
  highlightedRightIndex: number = 0;
  constructor(private adhocReportService: AdhocReportService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getReportData();
  }

  getReportData() {
    this.adhocReportService.getReportColumnDropdown('').subscribe((response: any) => {
      this.colFiltersData = response.adHocReportsColumnFilter;
      this.columnsList = response.adHocReportsColumnFilter.filter((e: any) => e.type === "C");
      this.filtersList = response.adHocReportsColumnFilter.filter((e: any) => e.type === "F");
      this.reportFilters = response.filters;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onSingleSelect() {
    this.selectedColumns.push(this.highlightedLeftColumn);
    this.columnsList.splice(this.highlightedLeftIndex, 1)
  }

  onSelectAll() {
    this.selectedColumns = this.colFiltersData.filter((e: any) => e.type === "C");
    this.columnsList = [];
    this.highlightedLeftColumn = {};
  }

  onSingleDeselect() {
    this.columnsList.push(this.highlightedRightColumn);
    this.selectedColumns.splice(this.highlightedRightIndex, 1)
  }

  onDeselectAll() {
    this.selectedColumns = [];
    this.columnsList = this.colFiltersData.filter((e: any) => e.type === "C");
    this.highlightedRightColumn = {}
  }

}
