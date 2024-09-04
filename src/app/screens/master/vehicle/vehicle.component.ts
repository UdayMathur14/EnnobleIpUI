import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';
import { VehicleService } from '../../../core/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';
import { TransporterService } from '../../../core/service/transporter.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit{

  isFilters: boolean = true;
  vehiclesList: any[] = [];
  fullScreen : boolean = false;
  vehicleList: any [] = [];
  transportersList : any[] = [];
  headers: any [] = [];
  loadSpinner : boolean = true;
  locations: any[] = APIConstant.commonLocationsList;
  transporterOffset: number = 0;
  transporterCount: number = Number.MAX_VALUE;
  currentPage: number = 1;
  count: number = 10;
  totalVehicles: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(private router: Router,
    private xlsxService: XlsxService,
    private vehicleService : VehicleService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.getVehicleList();
  }

  getVehicleList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters){
    let data = {
      "locationIds": filters?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "vehicleNumber": filters?.vehicleNumber ||  "",
      "transporter": filters?.transporterId ||  "",
      "vehicleSizeCode": filters?.vehcileSize ||  "",
      "status": filters?.status || ""
    }
    this.vehicleService.getVehicles(data, offset, count).subscribe((response:any) => {
      this.vehiclesList = response.vehicles;
      this.totalVehicles = response.paging.total;
      this.filters = response.filters
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getVehicleList(0, this.count, this.appliedFilters);
  }

  //ROUTING TO CREATE VEHICLE PAGE
  onCreateVehicle() {
    this.router.navigate(['master/addVehicle'])
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Vehicle") {
    let data = {
      "locationIds": this.appliedFilters?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      "vehicleNumber": this.appliedFilters?.vehicleNumber ||  "",
      "transporter": this.appliedFilters?.transporterId ||  "",
      "vehicleSizeCode": this.appliedFilters?.vehcileSize ||  "",
      "status": this.appliedFilters?.status || ""
    }
    this.vehicleService.getVehicles(data, 0, this.totalVehicles).subscribe((response:any) => {
      const vehicleListToExport = response.vehicles;

      // Map the data to include only the necessary fields
    const mappedVehiclesList = vehicleListToExport.map((vehicle: any) => ({
      locationCode: vehicle.locations.value,
      vehicleNumber: vehicle.vehicleNumber,
      vehicleSize: vehicle.vehicleSize.value,
      transporterName: vehicle.transporterEntity.transporterName,
      ownerName: vehicle.transporterEntity.ownerName,
      transporterAddress1: vehicle.transporterEntity.transporterAddress1,
      transporterContactNo: vehicle.transporterEntity.transporterContactNo,
      transporterMailId: vehicle.transporterEntity.transporterMailId,
      vehicleCondition: vehicle.vehicleCondition,
      remarks: vehicle.remarks,
      status: vehicle.status
    }));
    this.xlsxService.xlsxExport(mappedVehiclesList, this.headers, fileName);
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
    
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getVehicleList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getVehicleList(0, this.count, this.appliedFilters);
    }
}
