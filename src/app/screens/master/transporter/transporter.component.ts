import { Component, OnInit } from '@angular/core';
import { ExportService } from '../../../core/service/export.service';
import { TransporterService } from '../../../core/service/transporter.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';

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
  constructor(private exportService: ExportService,
    private transporterService : TransporterService,
    private lookupService : LookupService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTransportersList();
    this.getCityDropdownData();
    this.getStateDropdownData();
  }

  getTransportersList() {
    let data = {
      "locationIds": [
        0
      ],
      "transporterCode": "",
      "transporterName": "",
      "city": "",
      "state": "",
      "taxationType": "",
      "locations": ""
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
      "locationIds": [
        0
      ],
      "transporterCode": e.transCode,
      "transporterName": e.transName,
      "city": e.cityCode,
      "state": e.stateCode,
      "taxationType": e.taxationType,
      "locations": e.locations
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

  exportData(fileName: string = "Transporter") {
    this.exportService.csvExport(fileName);
  }
}