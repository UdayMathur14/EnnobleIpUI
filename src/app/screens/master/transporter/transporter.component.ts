import { Component, OnInit } from '@angular/core';
import { ExportService } from '../../../core/service/export.service';
import { TransporterService } from '../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';
import { XlsxService } from '../../../core/service/xlsx.service';
<<<<<<< HEAD
import { APIConstant } from '../../../core/constants';
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

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
<<<<<<< HEAD
  locations: any[] = APIConstant.locationsListDropdown;
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
<<<<<<< HEAD
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
=======
      "locationIds": [
        0
      ],
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
      "transporterCode": "",
      "transporterName": "",
      "city": "",
      "state": "",
<<<<<<< HEAD
      "taxationType": ""
=======
      "taxationType": "",
      "locations": ""
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
<<<<<<< HEAD
      "locationIds": e.locations,
=======
      "locationIds": [
        0
      ],
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
      "transporterCode": e.transCode,
      "transporterName": e.transName,
      "city": e.cityCode,
      "state": e.stateCode,
<<<<<<< HEAD
      "taxationType": e.taxationType
=======
      "taxationType": e.taxationType,
      "locations": e.locations
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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