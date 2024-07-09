import { Component, OnInit } from '@angular/core';
import { ExportService } from '../../../core/service/export.service';
import { TransporterService } from '../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';
import { XlsxService } from '../../../core/service/xlsx.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-transporter',
  templateUrl: './transporter.component.html',
  styleUrl: './transporter.component.scss'
})
export class TransporterComponent implements OnInit{

  searchedTransporter: any;
  isFilters: boolean = true;
  fullScreen : boolean = false;
  loadSpinner : boolean = true;
  transportersList : any[] = [];
  cities : any[] = [];
  states : any[] = [];
  headers: any [] = [];
  locations: any[] = APIConstant.locationsListDropdown;
  currentPage: number = 1;
  count: number = 10;
  totalTransporters: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;

  constructor(private exportService: ExportService,
    private transporterService : TransporterService,
    private lookupService : LookupService,
    private toastr: ToastrService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit(): void {
    this.getTransportersList();
  }

  getTransportersList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    let data = {
      "locationIds": filters?.locations || APIConstant.locationsListDropdown.map((e: any) => (e.id)),
      "transporterCode": filters?.transCode,
      "transporterName": filters?.transName,
      "city": "",
      "state": "",
      "taxationType": "",
      "status": filters?.status
    }
    this.transporterService.getTransporters(data, offset, count).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.totalTransporters = response.paging.total;
      this.filters = response.filters
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getTransportersList(0, this.count, this.appliedFilters);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Transporter") {
    // Map the data to include only the necessary fields
    const mappedTransporterList = this.transportersList.map(transporter => ({
      transporterCode: transporter.transporterCode,
      transporterName: transporter.transporterName,
      locationId: transporter.locationId,
      consignorName: transporter.consignorName,
      ownerName: transporter.ownerName,
      contactPerson: transporter.contactPerson,
      transporterAddress1: transporter.transporterAddress1 + ", " +transporter.transporterAddress2,
      transporterContactNo: transporter.transporterContactNo,
      transporterMailId: transporter.transporterMailId,
      regdDetails: transporter.regdDetails,
      status: transporter.status,
      autoBiltiRequiredFlag: transporter.autoBiltiRequiredFlag
    }));
    this.xlsxService.xlsxExport(mappedTransporterList, this.headers, fileName);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getTransportersList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getTransportersList(0, this.count, this.appliedFilters);
    }
}