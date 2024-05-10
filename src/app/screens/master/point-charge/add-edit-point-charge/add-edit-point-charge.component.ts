import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BaseService } from '../../../../core/service/base.service';
import { PointChargeDataModel } from '../../../../core/model/masterModels.model';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-point-charge',
  templateUrl: './add-edit-point-charge.component.html',
  styleUrl: './add-edit-point-charge.component.scss'
})
export class AddEditPointChargeComponent implements OnInit {
  constructor(private router: Router,
    private _route: ActivatedRoute,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private baseService: BaseService) {
  }
  pointChargeId: any;
  pointChargeData!: PointChargeDataModel
  pointChargesList: any = [];
  loadSpinner: boolean = true;
  locationCode: string = '';
  pointChargeForm = new FormGroup({
    pointName: new FormControl('', [Validators.required]),
    pointCharge: new FormControl('', [Validators.required]),
    sameLocationCharge: new FormControl('', [Validators.required]),
    status: new FormControl('Active', [Validators.required]),
  })

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
        this.toastr.error(error.statusText, error.status);
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
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      })
    }
    if (this.pointChargeForm.valid && !this.pointChargeId) {
      let data = {
        pointName: this.pointChargeForm.get('pointName')?.value,
        pointCharge: this.pointChargeForm.get('pointCharge')?.value,
        sameLocationCharge: this.pointChargeForm.get('sameLocationCharge')?.value,
        actionBy: 1,
        status: this.pointChargeForm.get('status')?.value,
      }

      this.pointChargeService.createPointCharge(data)
        .subscribe((response: any) => {
          this.pointChargeData = response;
          this.toastr.success('Point Charge Created Successfully')
          this.loadSpinner = false;
          this.router.navigate(['/master/pointCharge'])
        }, error => {
          this.toastr.error(error.statusText, error.status);
          this.loadSpinner = false;
        })
    }
    this.loadSpinner = false;
  }
}


