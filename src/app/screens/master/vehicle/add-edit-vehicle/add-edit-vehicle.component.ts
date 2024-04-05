import { Component,OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../core/service/base.service';
import { VehicleService } from '../../../../core/service/vehicle.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleDataModel } from '../../../../core/model/masterModels.model';

@Component({
  selector: 'app-add-edit-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrl: './add-edit-vehicle.component.scss',
})
export class AddEditVehicleComponent implements OnInit {
  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private baseService: BaseService
  ) {}

  mode: any = 'create';
  vehicleId: any;
  vehicleData!: VehicleDataModel;
  vehiclesList: any = [];
  loadSpinner: boolean = true;
  lookupsList:any;
  transportersList = [
    {
      transporterId: 1,
      transporterName: 'V-Trans A Group',
      ownerName: 'Victor Pushin Pvt Ltd',
      address: 'Noida dadri road, Noida',
      mobilenoone: '9835626261',
      mobileno2: '8835926061',
      email: 'test@yahoo.com',
    },
  ];

  vehicleForm = new FormGroup({
    vehicleNumber: new FormControl('', [Validators.required]),
    transporterName: new FormControl(null, [Validators.required]),
    vehicleSize: new FormControl(null, [Validators.required]),
    vehicleCondition: new FormControl('', [Validators.required]),
    remarks: new FormControl('', [Validators.required]),
    vehicleStatus: new FormControl('Active', [Validators.required]),
    ownerName: new FormControl(''),
    address: new FormControl(''),
    mobileNumber1: new FormControl(''),
    mobileNumber2: new FormControl(''),
    emailId: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.mode == 'create') {
      this.loadSpinner = false;
    }

    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('vehicleId')) {
        this.mode = 'edit';
        this.vehicleId = paramMap.get('vehicleId')
      } else {
        this.mode = 'create';
        this.vehicleId = null;
      }
    })
    this.getVehicleData(this.vehicleId);
    this.getAllLookups();
  }

  // GET THE DATA OF SPECIFIC VEHICLE
  getVehicleData(vehicleId: string) {
    if (this.mode == 'edit') {
      this.loadSpinner = true;
      this.vehicleService.getVehicleData(vehicleId).subscribe((response: any) => {
        this.vehicleData = response;
        this.patchVehicleForm(response);
        this.loadSpinner = false;
      }, error => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      })
    }
  }

  // PATCHING VALUE ON EDIT FORM
  patchVehicleForm(data: any) {
    console.log(data)
    this.vehicleForm.patchValue({
      vehicleNumber: data.vehicleNumber,
      transporterName: data.transporterEntity.transporterName,
      vehicleSize: data.vehicleSize,
      vehicleCondition: data.vehicleCondition,
      remarks: data.remarks,
      vehicleStatus: data.status,
      ownerName: data.transporterEntity.ownerName,
      address: data.transporterEntity.transporterAddress1,
      mobileNumber1: data.transporterEntity.transporterContactNo,
      emailId: data.transporterEntity.transporterMailId,
    });
  }

  onOptionSelected(selected: any) {
    this.vehicleForm.patchValue({
      ownerName: selected[0].ownerName,
      address: selected[0].address,
      mobileNumber1: selected[0].mobilenoone,
      mobileNumber2: selected[0].mobileno2,
      emailId: selected[0].email,
    });
  }

  // CREATING OR EDITING NEW VEHICLE
  onPressSave() {
    this.loadSpinner = true;
    if (this.mode == 'edit') {
      let data = {
        transporterId: 1,
        vehicleCondition: this.vehicleForm.get('vehicleCondition')?.value,
        remarks: this.vehicleForm.get('remarks')?.value,
        status: this.vehicleForm.get('vehicleStatus')?.value,
        actionBy: 1,
      }

      this.vehicleService.updateVehicle(this.vehicleId, data)
        .subscribe((response: any) => {
          this.vehicleData = response;
          this.toastr.success('Vehicle Updated Successfully')
          this.loadSpinner = false;
          this.router.navigate(['/master/vehicle'])
        }, error => {
          this.toastr.error(error.statusText, error.status);
          this.loadSpinner = false;
        })

    this.loadSpinner = false;
  }
    if (this.mode == 'create') {
      let data = {
        vehicleNumber: this.vehicleForm.get('vehicleNumber')?.value,
        vehicleSizeId: this.vehicleForm.get('vehicleSize')?.value,
        transporterId: 1,
        actionBy: 1,
        vehicleCondition: this.vehicleForm.get('vehicleCondition')?.value,
        remarks: this.vehicleForm.get('remarks')?.value,
        status: this.vehicleForm.get('vehicleStatus')?.value,
      }

      this.vehicleService.createVehicle(data)
        .subscribe((response: any) => {
          this.vehicleData = response;
          this.toastr.success('Vehicle Created Successfully')
          this.loadSpinner = false;
          this.router.navigate(['/master/vehicle'])
        }, error => {
          this.toastr.error(error.statusText, error.status);
          this.loadSpinner = false;
        })
  
    this.loadSpinner = false;
  }

  }

  // GET VEHICLE SIZE
  getAllLookups() {
    let data = {
      "code" : 'VehicleSize',
    }
    this.vehicleService.getLookups(data).subscribe((response:any) => {
      this.lookupsList = response.lookUps;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }
  
  // ROUTING TO MASTER PAGE
  onCancelPress() {
    this.router.navigate(['master/vehicle']);
  }
}
