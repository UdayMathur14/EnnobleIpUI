import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { PointChargeService } from '../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-point-charge',
  templateUrl: './point-charge.component.html',
  styleUrls: ['./point-charge.component.scss'],
})
export class PointChargeComponent implements OnInit {
  locations: any[] = APIConstant.locationsListDropdown;
  isFilters: boolean = true;
  fullScreen: boolean = false;
  loadSpinner: boolean = true;
  pointChargesList: any[] = [];
  headers: any[] = [];
  currentPage: number = 1;
  count: number = 10;
  totalPointCharges: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(
    private router: Router,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private xlsxService: XlsxService
  ) {}

  ngOnInit() {
    this.getPointChargesList();
  }

  getPointChargesList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    let data = {
      locationIds:
        filters?.locationIds ||
        APIConstant.commonLocationsList.map((e: any) => e.id),
      screenCode: 101,
      pointName: filters?.pointName || '',
      status: filters?.status || '',
    };
    this.pointChargeService.getPointCharges(data, offset, count).subscribe(
      (response: any) => {
        this.pointChargesList = response.pointCharges;
        this.totalPointCharges = response.paging.total;
        this.filters = response.filters;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getPointChargesList(0, this.count, this.appliedFilters);
  }

  // NAVIGATING TO CREATE POINT CHARGE PAGE
  onCreatePointCharge() {
    this.router.navigate(['master/addPointCharge']);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = 'Point Charge') {
    let data = {
      locationIds:
        this.appliedFilters?.locationIds ||
        APIConstant.locationsListDropdown.map((e: any) => e.id),
      screenCode: 101,
      pointName: this.appliedFilters?.pointName || '',
      status: this.appliedFilters?.status || '',
    };
    this.pointChargeService
      .getPointCharges(data, 0, this.totalPointCharges)
      .subscribe(
        (response: any) => {
          const pointChargesListToExport = response.pointCharges;
          // Map the data to include only the necessary fields
          const mappedPointChargeList = pointChargesListToExport.map(
            (pointcharge: any) => ({
              pointName: pointcharge?.pointName,
              pointCharge: pointcharge?.pointCharge,
              sameLocationCharge: pointcharge?.sameLocationCharge,
              locations: pointcharge?.locations.value,
              materialRemarks: pointcharge?.materialRemarks,
              accountsRemarks: pointcharge?.accountsRemarks,
              status: pointcharge?.status,
            })
          );
          this.xlsxService.xlsxExport(
            mappedPointChargeList,
            this.headers,
            fileName
          );
          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(
            error.error.details
              .map((detail: any) => detail.description)
              .join('<br>')
          );
          this.loadSpinner = false;
        }
      );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getPointChargesList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getPointChargesList(0, this.count, this.appliedFilters);
  }
}
