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
  mode: any = 'create';
  pointChargeId: any;
  pointChargeData!: PointChargeDataModel
  pointChargesList: any = [];
  loadSpinner: boolean = true;
  lookupId=1;
  lookupIdvalue:string=''
  pointChargeForm = new FormGroup({
    pointName: new FormControl('', [Validators.required]),
    pointCharge: new FormControl('', [Validators.required]),
    sameLocationCharge: new FormControl('', [Validators.required]),
    status: new FormControl('Active', [Validators.required]),
  })

  ngOnInit(): void {
    this.getLookupData()
    if (this.mode == 'create') {
      this.loadSpinner = false;
    }

    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('pointChargeId')) {
        this.mode = 'edit';
        this.pointChargeId = paramMap.get('pointChargeId')
      } else {
        this.mode = 'create';
        this.pointChargeId = null;
      }
    })
    this.getPointChargeData(this.pointChargeId)
        // Enable or disable status control based on mode for Create and Update
        const statusControl = this.pointChargeForm.get('status');
        if(statusControl){
          if(this.mode == 'create'){
            statusControl.disable()
          }
        }
  }

  // GET SPECIFIC POINT CHARGE DATA
  getPointChargeData(pointChargeId: string) {
    if (this.mode == 'edit') {
      this.loadSpinner = true;
    }

    if (this.mode == 'edit') {
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
    if (this.pointChargeForm.valid && this.mode == 'edit') {
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
      }, error => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      })
    }
    if (this.pointChargeForm.valid && this.mode == 'create') {
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

  getLookupData(){
    this.pointChargeService.getLookups(this.lookupId).subscribe((response: any) => {
      this.lookupIdvalue = response.value;
    })
}
}


