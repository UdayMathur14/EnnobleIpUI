import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { FreightService } from '../../../core/service/freight.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent implements OnInit{

  isFilters: boolean = true;
  searchedFreight: any;
  fullScreen: boolean = false;
  loadSpinner: boolean = true;
  vehcileSizes : any[] = [];
  destinations : any[] = [];
  sources : any[] = [];
  freightList: any[] = [];
  headers: string[] = [];
  locations: any[] = APIConstant.locationsListDropdown;
  currentPage: number = 1;
  count: number = 10;
  totalFreights: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(
    private router: Router,
    private xlsxService : XlsxService,
    private freightService : FreightService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getFreightList()
  }

  getFreightList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    let data = {
      "locationIds": filters?.locationIds ||  APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "screenCode": 101,
      "freightCode": filters?.freightCode,
      "source": filters?.source,
      "destination": filters?.destination,
      "vehicleSize": filters?.vehicleSize,
      "status": filters?.status
    }
    this.freightService.getFreightsList(data, offset, count).subscribe((response: any) => {
      this.freightList = response.freights;
      this.totalFreights = response.paging.total;
      this.filters = response.filters
      this.loadSpinner = false;
    }, error => {
      // this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getFreightList(0, this.count, this.appliedFilters);
  }


  //FUNCTION TO REDIRECT USER ON FREIGHT CREATION SCREEN
  onCreateFreight() {
    this.router.navigate(['master/addEditFreight', '0'])
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Freight") {
    let data = {
      "locationIds": this.appliedFilters?.locationIds ||  APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "screenCode": 101,
      "freightCode": this.appliedFilters?.freightCode,
      "source": this.appliedFilters?.source,
      "destination": this.appliedFilters?.destination,
      "vehicleSize": this.appliedFilters?.vehicleSize,
      "status": this.appliedFilters?.status
    }
    this.freightService.getFreightsList(data, 0, this.totalFreights).subscribe((response: any) => {
      const freightListToExport = response.freights;
      const mappedPlantsList = freightListToExport.map((freight: any) => ({
        freightCode: freight?.freightCode,
        locations: freight?.locations?.value,
        source: freight?.source?.value,
        destination: freight?.destination?.value,
        vehicleSize: freight?.vehicleSize?.value,
        freightAmount: freight?.freightAmount,
        remarks: freight?.remarks,
        materialRemarks: freight?.materialRemarks,
        accountsRemarks: freight?.accountsRemarks,
        status: freight?.status
      }));
      this.xlsxService.xlsxExport(mappedPlantsList, this.headers, fileName);
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
    
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getFreightList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getFreightList(0, this.count, this.appliedFilters);
    }
} 
