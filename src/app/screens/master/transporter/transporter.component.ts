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
  constructor(private exportService: ExportService,
    private transporterService : TransporterService,
    private lookupService : LookupService,
    private toastr: ToastrService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit(): void {
    this.getTransportersList();
    this.getCityDropdownData();
    this.getStateDropdownData();
  }

  getTransportersList() {
    let data = {
      "locationIds": [],
      "transporterCode": "",
      "transporterName": "",
      "city": "",
      "state": "",
      "taxationType": ""
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "locationIds": e.locations,
      "transporterCode": e.transCode,
      "transporterName": e.transName,
      "city": e.cityCode,
      "state": e.stateCode,
      "taxationType": e.taxationType
    }
    this.transporterService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    })
  }

  getCityDropdownData(){
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'City'
    this.lookupService.getDropdownData(type).subscribe((res:any)=>{
      this.cities = res.lookUps;
    })
  }

  getStateDropdownData(){
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'State'
    this.lookupService.getDropdownData(type).subscribe((res:any)=>{
      this.states = res.lookUps;
    })
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
}