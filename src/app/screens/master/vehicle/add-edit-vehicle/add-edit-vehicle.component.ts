import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../core/service/base.service';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleDataModel } from '../../../../core/model/vehicle.model';

@Component({
  selector: 'app-add-edit-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrl: './add-edit-vehicle.component.scss'
})
export class AddEditVehicleComponent {
  constructor(private router: Router,
    private _route: ActivatedRoute,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private baseService: BaseService) { }

  mode: any = 'create';
  vehicleId: any;
  vehicleData!: VehicleDataModel
  vehiclesList: any = [];
  lookupId: number = 4;
  locationId: number = 0;
  loadSpinner: boolean = true;
  vehicleForm = new FormGroup({
    vehicleNumber: new FormControl('', [Validators.required]),
    tarnsporterName: new FormControl('', [Validators.required]),
    vehicleSize: new FormControl('', [Validators.required]),
    vehicleCondition: new FormControl('', [Validators.required]),
    remarks: new FormControl('', [Validators.required]),
    vehicleStatus: new FormControl('', [Validators.required]),
    createdBy: new FormControl('', [Validators.required]),
  })


  onCancelPress() {
    this.router.navigate(['master/vehicle']);
  }
}