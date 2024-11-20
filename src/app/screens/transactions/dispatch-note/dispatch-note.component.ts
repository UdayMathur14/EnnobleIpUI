import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { DispatchNoteService } from '../../../core/service/dispatch-note.service';
import { APIConstant } from '../../../core/constants';
import { XlsxService } from '../../../core/service/xlsx.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dispatch-note',
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss',
  providers: [DatePipe]
})
export class DispatchNoteComponent {

  isFilters: boolean = true;
  dispatchNumber: string = "";
  dispatchNotes = [];
  locations: any = [];
  loadSpinner: boolean = true;
  currentPage: number = 1;
  count: number = 10;
  totaldispatchNotes: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  headers: any [] = [];

  constructor(private router: Router,
    private dispatchNoteService: DispatchNoteService,
    private xlsxService: XlsxService,
    private toastr : ToastrService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getDispatchData();
  }

  getDispatchData(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    const data = {
      "locationIds": filters?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "dispatchNumber": filters?.dispatchNumber || "",
      "status": filters?.status || "",
      "frlrNumber": filters?.frlrNo || "",
      "dispatchStatus": filters?.dispatchStatus,
      "transporterCode": "",
      "transporterName": "",
      "vendorCodes": [],
      "vendorNames": [],
    }
    this.loadSpinner = true;
    this.dispatchNoteService.getDispatchNote(data, offset, count).subscribe((res: any) => {
      this.dispatchNotes = res.dispatchNotes;
      this.totaldispatchNotes = res.paging.total;
      this.filters = res.filters;
      this.loadSpinner = false;
    },error => {
      this.loadSpinner = false;
  }) 
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getDispatchData(0, this.count, this.appliedFilters);
  }

  onCreateDispatchNote() {
    this.router.navigate(['transaction/addEditDispatchNote/0'])
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getDispatchData(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getDispatchData(0, this.count, this.appliedFilters);
    }

    onExportHeader(headers: any) {
      this.headers = headers;
    }

    exportData(fileName: string = "Dispatch Notes") {
      const data = {
        "locationIds": this.appliedFilters?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id)),
        "dispatchNumber": this.appliedFilters?.dispatchNumber || "",
        "status": this.appliedFilters?.status || "",
        "frlrNumber": this.appliedFilters?.frlrNo || ""
      }
      this.dispatchNoteService.getDispatchNote(data, 0, this.totaldispatchNotes).subscribe((response: any) => {
        const dispatchListToExport = response.dispatchNotes;
      const mappedDispatchNotesList = dispatchListToExport.map((item: any) => ({
        locationCode: item?.locations?.value,
        dispatchNumber: item?.dispatchNumber,
        frlrNo: item?.frlrNumber,
        frlrDate: this.datePipe.transform(item.frlrDate, 'yyyy-MM-dd'),
        transporterCode: item?.transporter?.transporterCode,
        transporterName: item?.transporter?.transporterName,
        supplierCode: item?.suppliers?.vendorCode,
        supplierName: item?.suppliers?.vendorName,
        vehicleNumber: item?.vehicles.vehicleNumber,
        vehcileSize: item?.vehicles?.vehicleSize?.value,
        status: item?.openFlag
      }));
      this.xlsxService.xlsxExport(mappedDispatchNotesList, this.headers, fileName);
        this.loadSpinner = false;
      }, error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      })
      
    }

}
