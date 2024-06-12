import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../../core/service/vehicle.service';

@Component({
  selector: 'app-vehicle-filters',
  templateUrl: './vehicle-filter.component.html',
  styleUrl: './vehicle-filter.component.scss'
})
export class VehicleFiltersComponent implements OnInit {
<<<<<<< HEAD
  @Input() locations : any[] = [];
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() vehiclesList: any[] = [];
  @Input() transportersList : any[] = [];
  @Input() locationIds : any = [];
=======
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() vehiclesList: any[] = [];
  @Input() transportersList : any[] = [];
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  vehicleNum : any = undefined;
  transporterNam : any = undefined;
  loadSpinner: boolean = true;
  transporterId: number = 0;
  allVehicleNo: any = [];
  filteredVehicleNo: any = [];

  constructor(
<<<<<<< HEAD
  ) { }
=======
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

  ngOnInit(): void {
  }

  onVehicleSearch() {
    let obj = {
      "vehicleNumber": this.vehicleNum || "",
<<<<<<< HEAD
      "transporterId": this.transporterNam || "",
      "locationIds" : this.locationIds || []
=======
      "transporterId": this.transporterNam
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.vehicleNum = undefined;
<<<<<<< HEAD
    this.transporterNam = undefined;
    this.locationIds = [];
    let obj = {
      "vehicleNumber": undefined,
      "transporterNam": undefined,
      "locationIds" : []
=======
    this.transporterNam = undefined
    let obj = {
      "vehicleNumber": undefined,
      "transporterNam": undefined
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(obj)
  }
}
