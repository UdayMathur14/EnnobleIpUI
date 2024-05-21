import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BaseService } from '../../../../core/service/base.service';
import { PointChargeDataModel } from '../../../../core/model/masterModels.model';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-point-charge',
  templateUrl: './add-edit-point-charge.component.html',
  styleUrl: './add-edit-point-charge.component.scss'
})
export class AddEditPointChargeComponent implements OnInit {
  pointChargeForm: FormGroup;
  pointChargeId: any;
  pointChargeData!: PointChargeDataModel
  pointChargesList: any = [];
  loadSpinner: boolean = true;
  locationCode: string = '';
  pointNameData: any = [];

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private baseService: BaseService,
    private lookupService: LookupService,
    private formBuilder: FormBuilder,
  ) {
    this.pointChargeForm = this.formBuilder.group({
      pointName: ['', [Validators.required]],
      pointCharge: ['', [Validators.required]],
      sameLocationCharge: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
    })
  }


  ngOnInit(): void {
    if (!this.pointChargeId) {
      this.loadSpinner = false;
    }

    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('pointChargeId')) {
        this.pointChargeId = paramMap.get('pointChargeId')
      } else {
        this.pointChargeId = null;
      }
    })
    this.getPointChargeData(this.pointChargeId)
    this.getCityLookup();
  }

  getCityLookup() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'City';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.pointNameData = res.lookUps;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    });
  }

  // GET SPECIFIC POINT CHARGE DATA
  getPointChargeData(pointChargeId: string) {
    if (this.pointChargeId) {
      this.loadSpinner = true;
      this.pointChargeService.getPointChargeData(pointChargeId).subscribe((response: any) => {
        this.pointChargeData = response;
        this.patchPointChargeForm(response);
        this.loadSpinner = false;
      }, error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      })
    }

  }

  //PATCHING VALUE ON EDIT FORM
  patchPointChargeForm(data: any) {
    this.locationCode = data.locations.value
    this.pointChargeForm.patchValue({
      pointName: data.pointName,
      pointCharge: data.pointCharge,
      sameLocationCharge: data.sameLocationCharge,
      status: data.status,
    });
  }


  data = [
    { name: "United States", code: "USA" },
    { name: "United States", code: "USA" },
    { name: "United States", code: "USA" },
    { name: "United States", code: "USA" }
  ];

  results: any = [];

  // NAVIGATING TO MASTER PAGE
  onCancelPress() {
    this.router.navigate(['/master/pointCharge'])
  }

  filterCountry(e: any) {
    this.results = this.data.filter((element) => element.name.toLowerCase().indexOf(e.query.toLowerCase()) !== -1)
  }

  // CREATING OR EDITING NEW POINT CHARGE
  onPressSave() {
    this.loadSpinner = true;
    if (this.pointChargeForm.valid && this.pointChargeId) {
      let data = {
        pointName: this.pointChargeForm.get('pointName')?.value,
        pointCharge: this.pointChargeForm.get('pointCharge')?.value,
        sameLocationCharge: this.pointChargeForm.get('sameLocationCharge')?.value,
        actionBy: 1,
        status: this.pointChargeForm.get('status')?.value,
      }

      this.pointChargeService.updatePointCharge(this.pointChargeId, data).subscribe((response: any) => {
        this.pointChargeData = response;
        this.toastr.success('Point Charge Updated Successfully')
        this.loadSpinner = false;
        this.router.navigate(['/master/pointCharge']);
      }, error => {
        this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      })
    }
    if (this.pointChargeForm.valid && !this.pointChargeId) {
      let data = {
        pointCharge: this.pointChargeForm.get('pointCharge')?.value,
        pointName: this.pointChargeForm.get('pointName')?.value.name,
        cityId: this.pointChargeForm.get('pointName')?.value.id,
        sameLocationCharge: this.pointChargeForm.get('sameLocationCharge')?.value,
        actionBy: 1,
        status: this.pointChargeForm.get('status')?.value,

      }
      // }

      this.pointChargeService.createPointCharge(data)
        .subscribe((response: any) => {
          this.pointChargeData = response;
          this.toastr.success('Point Charge Created Successfully')
          this.loadSpinner = false;
          this.router.navigate(['/master/pointCharge'])
        }, error => {
          this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        })
    }
    this.loadSpinner = false;
  }
}


