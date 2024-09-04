import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BaseService } from '../../../../core/service/base.service';
import { PointChargeDataModel } from '../../../../core/model/masterModels.model';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant, getDropdownDatas } from '../../../../core/constants';
import { FreightService } from '../../../../core/service/freight.service';

@Component({
  selector: 'app-add-edit-point-charge',
  templateUrl: './add-edit-point-charge.component.html',
  styleUrl: './add-edit-point-charge.component.scss',
})
export class AddEditPointChargeComponent implements OnInit {
  pointChargeForm: FormGroup;
  pointChargeId: any;
  pointChargeData!: PointChargeDataModel;
  pointChargesList: any = [];
  loadSpinner: boolean = true;
  locationCode: string = '';
  pointNameData: any = [];
  locationId!: Number;
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = APIConstant.commonLocationsList;
  pointChargeLocationId: number = 0;
  nocFileBase64: any = '';
  nocFileName: string = '';
  destinations: any = [];
  isFileUploaded: boolean = false;

  constructor(
    private router: Router,
    private _route: ActivatedRoute,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private baseService: BaseService,
    private lookupService: LookupService,
    private formBuilder: FormBuilder,
    private freightService: FreightService
  ) {
    this.pointChargeForm = this.formBuilder.group({
      locationCode: [undefined, [Validators.required]],
      pointName: ['', [Validators.required]],
      pointCharge: ['', [Validators.required]],
      sameLocationCharge: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      newPointCharge: [''],
      newSameLocationCharge: ['']
    });
  }

  ngOnInit(): void {
    if (!this.pointChargeId) {
      this.loadSpinner = false;
    }

    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('pointChargeId')) {
        this.pointChargeId = paramMap.get('pointChargeId');
      } else {
        this.pointChargeId = null;
      }
    });
    if (this.pointChargeId > 0) {
      this.getEditPointChargeData();
    }
    this.getCityLookup();
    this.setLocation();
    this.getDestinationDropdownData();
  }

  getCityLookup() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'City';
    this.lookupService.getLocationsLookup(data, type).subscribe(
      (res: any) => {
        this.pointNameData = res.lookUps;
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.baseService.plantSpinner.next(false);
        this.loadSpinner = false;
      }
    );
  }

  // GET SPECIFIC POINT CHARGE DATA
  getPointChargeData(pointChargeId: string) {
    if (this.pointChargeId) {
      this.loadSpinner = true;
      this.pointChargeService
        .getPointChargeData(this.pointChargeLocationId, pointChargeId)
        .subscribe(
          (response: any) => {
            this.pointChargeData = response;
            this.patchPointChargeForm(response);
            this.loadSpinner = false;
          },
          (error) => {
            //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
            this.loadSpinner = false;
          }
        );
    }
  }

  //PATCHING VALUE ON EDIT FORM
  patchPointChargeForm(data: any) {
    this.locationCode = data.locations.value;
    this.pointChargeForm.patchValue({
      pointName: data.pointName,
      pointCharge: data.pointCharge,
      sameLocationCharge: data.sameLocationCharge,
      status: data.status,
      locationCode: data.locations.id,
    });
    this.checkApprovalStatus(data.approvedByMaterial, data.approvedByAccounts);
  }

  data = [
    { name: 'United States', code: 'USA' },
    { name: 'United States', code: 'USA' },
    { name: 'United States', code: 'USA' },
    { name: 'United States', code: 'USA' },
  ];

  results: any = [];

  // NAVIGATING TO MASTER PAGE
  onCancelPress() {
    this.router.navigate(['/master/pointCharge']);
  }

  filterCountry(e: any) {
    this.results = this.data.filter(
      (element) =>
        element.name.toLowerCase().indexOf(e.query.toLowerCase()) !== -1
    );
  }

  // CREATING OR EDITING NEW POINT CHARGE
  onPressSave() {
    this.loadSpinner = true;
    const cityData = this.destinations.find((item: any) => item.value == this.pointChargeForm.value.pointName);
    const cityId = cityData?.id
    
    const locationCode = this.pointChargeForm.controls['locationCode']?.value;
    if (this.pointChargeForm.valid && this.pointChargeId) {
      let data = {
        pointName: this.pointChargeForm.get('pointName')?.value,
        pointCharge: this.pointChargeForm.get('pointCharge')?.value,
        sameLocationCharge:
          this.pointChargeForm.get('sameLocationCharge')?.value,
        actionBy: localStorage.getItem('userId'),
        status: this.pointChargeForm.get('status')?.value,
         cityId: cityId,
        fileName: this.nocFileName,
        fileData: this.nocFileBase64,
        newPointCharge: parseInt(this.pointChargeForm.get('newPointCharge')?.value) || 0,
        newSameLocationCharge: parseInt(this.pointChargeForm.get('newSameLocationCharge')?.value) || 0,
      };

      this.pointChargeService
        .updatePointCharge(locationCode, this.pointChargeId, data)
        .subscribe(
          (response: any) => {
            this.pointChargeData = response;
            this.toastr.success('Point Charge Updated Successfully');
            this.router.navigate(['/master/pointCharge']);
            this.loadSpinner = false;
          },
          (error) => {
            //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
            this.loadSpinner = false;
          }
        );
    }
    if (this.pointChargeForm.valid && !this.pointChargeId) {
      let data = {
        pointCharge: this.pointChargeForm.get('pointCharge')?.value,
        pointName: this.pointChargeForm.get('pointName')?.value.name,
        cityId: this.pointChargeForm.get('pointName')?.value.id,
        sameLocationCharge:
          this.pointChargeForm.get('sameLocationCharge')?.value,
        actionBy: localStorage.getItem('userId'),
        status: this.pointChargeForm.get('status')?.value,
        fileName: this.nocFileName,
        fileData: this.nocFileBase64
      };
      // }

      this.pointChargeService.createPointCharge(locationCode, data).subscribe(
        (response: any) => {
          this.pointChargeData = response;
          this.toastr.success('Point Charge Created Successfully');
          this.router.navigate(['/master/pointCharge']);
          this.loadSpinner = false;
        },
        (error) => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
    }
  }

  setLocation() {
    if (!this.pointChargeId) {
      this.lookupService.setLocationId(
        this.pointChargeForm,
        this.commonLocations,
        'locationCode'
      );
    }
  }

  getEditPointChargeData() {
    this.loadSpinner = true;
    let data = {
    "locationIds": APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      screenCode: 101,
      pointName: '',
    };
    this.pointChargeService.getPointCharges(data).subscribe(
      (response: any) => {
        this.pointChargesList = response.pointCharges;
        this.getLocationId().then(() => {
          this.getPointChargeData(this.pointChargeId);
        });
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(
          error.error.details
            .map((detail: any) => detail.description)
            .join('<br>')
        );
        this.loadSpinner = false;
      }
    );
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const pointCharge = this.pointChargesList.filter((item: any) => {
        return item.id == this.pointChargeId;
      });
      if (pointCharge.length > 0) {
        this.pointChargeLocationId = pointCharge[0].locations.id;
        resolve();
      } else {
        reject('No matching vehicle found');
      }
    });
  }

  checkApprovalStatus(approvedByMaterial: string, approvedByAccounts: string) {
    if (
      approvedByAccounts == null ||
      approvedByMaterial == null ||
      approvedByMaterial.includes('Rejected By') ||
      approvedByAccounts.includes('Rejected By')
    ) {
      this.pointChargeForm.get('status')?.disable();
    } else {
      this.pointChargeForm.get('status')?.enable();
    }
  }

  getDestinationDropdownData() {
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'Destination'
    this.freightService.getDropdownData(data, type).subscribe((res: any) => {
      this.destinations = res.lookUps
    })
  }


  onUploadPdf(evt: any) {
    const file = evt.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;
  
    if (file.size > maxSizeInBytes) {
      this.toastr.error('File size should be less than 5MB', 'Error');
      this.isFileUploaded = false;
      return;
    }
  
    this.nocFileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      this.nocFileBase64 = base64String;
      this.toastr.success('PDF Added', 'Success');
      this.isFileUploaded = true;
    };
  }
}
