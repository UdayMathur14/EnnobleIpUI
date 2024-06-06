import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../../core/service/vehicle.service';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-vehicle-filters',
  templateUrl: './vehicle-filter.component.html',
  styleUrl: './vehicle-filter.component.scss'
})
export class VehicleFiltersComponent implements OnInit {

  
  @Output() vehicleFilterData: EventEmitter<any> = new EventEmitter();
  vehiclesList: any;
  vehicleNum!: any | null;
  transporterNam!: any | null;
  transportersList = [];
  loadSpinner: boolean = true;
  filteredVehicles: any = [];
  allVehicleNames = [];
  showSuggestions: boolean = false;
  showSuggestionsVehicle: boolean = false;
  transporterId: number = 0;
  allVehicleNo: any = [];
  filteredVehicleNo: any = [];
  locations: any[] = APIConstant.locationsListDropdown;
  locationIds: any[] = [];

  constructor(
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.getAllTransportersList();
    this.getAllVehiclesListInit();
  }

  // GET ALL VEHICLES DATA
  getAllVehiclesListInit() {
    let data = {
      "vehicleNumber": '',
      "transporterId": 0,
      locationIds: []
    }
    this.vehicleService.getVehicles(data).subscribe((response: any) => {
      this.vehiclesList = response.vehicles;
      this.allVehicleNo = response.vehicles.map((vehicle: any) => vehicle.vehicleNumber);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
  }

  onVehicleSearch() {
    let obj = {
      "vehicleNumber": this.vehicleNum || "",
      "transporterId": this.transporterId,
      locationIds: this.locationIds
    }
    this.vehicleFilterData.emit(obj)
  }

  onClearFilter() {
    this.vehicleNum = null;
    this.transporterNam = null
    let obj = {
      vehicleNum: null,
      transporterNam: null,
      locationIds: []
    }
    this.vehicleFilterData.emit(obj)
  }

  getAllTransportersList() {
    let data = {
      "transporterCode": '',
      "transporterName": '',
      locationIds: this.locationIds
    }
    this.vehicleService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.allVehicleNames = response.transporters.map((vehicles: any) => vehicles);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onTransporterNameInput() {
    this.filteredVehicles = this.allVehicleNames.filter((vehicle: any) =>
      vehicle.transporterName.toLowerCase().includes(this.transporterNam.toLowerCase())
    );
    this.showSuggestions = this.filteredVehicles.length > 0;
  }

  selectSuggestion(vehicle: any) {
    this.transporterNam = vehicle.transporterName;
    this.transporterId = vehicle.id;
    this.filteredVehicles = [];
    this.showSuggestions = false;
  }

  onVehicleNoInput(inputText: string) {
    this.filteredVehicleNo = this.allVehicleNo.filter((name: any) => name.toLowerCase().includes(inputText.toLowerCase()));
    this.filteredVehicleNo.length ? this.showSuggestionsVehicle = true : this.showSuggestionsVehicle = false;
  }

  selectSuggestionVehicleNo(vehicle: string) {
    this.vehicleNum = vehicle;
    this.filteredVehicleNo = [];
    this.showSuggestionsVehicle = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
      this.showSuggestionsVehicle = false;
    }
  }
}
