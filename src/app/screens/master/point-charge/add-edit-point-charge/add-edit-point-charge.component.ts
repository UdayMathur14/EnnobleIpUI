import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BaseService } from '../../../../core/service/base.service';
import { PointChargeDataModel } from '../../../../core/model/point-charge.model';
import { PointChargeService } from '../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-point-charge',
  templateUrl: './add-edit-point-charge.component.html',
  styleUrl: './add-edit-point-charge.component.scss'
})
export class AddEditPointChargeComponent implements OnInit {
  constructor(private router : Router,
    private _route: ActivatedRoute,
    private pointChargeService: PointChargeService,
    private toastr: ToastrService,
    private baseService : BaseService){
    }
    mode:any = 'create';
    pointChargeId:any;
    pointChargeData!:PointChargeDataModel
    pointChargesList: any = [];
    lookupId:number=4;
    locationValue:string='';
    locationId:number=0;
    loadSpinner : boolean = true;
    pointChargeForm = new FormGroup({
      // locationId: new FormControl(2, [Validators.required]),
      pointName: new FormControl('', [Validators.required]),
      pointCharge: new FormControl('', [Validators.required]),
      sameLocationCharge: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    })

  ngOnInit(): void {
    if(this.mode=='create'){
      this.loadSpinner = false;
    }

    this._route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.has('pointChargeId')){
        this.mode = 'edit';
        this.pointChargeId = paramMap.get('pointChargeId')
      }else {
        this.mode = 'create';
        this.pointChargeId = null;
      } 
    })  
    this.getLookupData()
  }

  getPointChargeData(pointChargeId: string,locationId:any) {
    this.loadSpinner = true;
    if(this.mode == 'edit'){
      this.pointChargeService.getPointChargeData(locationId,pointChargeId).subscribe((response: any) => {
        this.pointChargeData = response;
        this.patchPointChargeForm(response);
        this.loadSpinner = false;
      }, error => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      })
    }
    
  }

  patchPointChargeForm(data:any) {
    this.pointChargeForm.patchValue({
      pointName: data.pointName,
      pointCharge: data.pointCharge,
      sameLocationCharge: data.sameLocationCharge,
      status: data.status,
    });
  }

  getLookupData(){
      this.pointChargeService.getLookupData(this.lookupId).subscribe((response: any) => {
        this.locationValue = response.value;
        this.locationId = response.id;
        this.getPointChargeData(this.pointChargeId, this.locationId)
      })
  }
  

  data = [
    {name: "United States", code:"USA"},
    {name: "United States", code:"USA"},
    {name: "United States", code:"USA"},
    {name: "United States", code:"USA"}
  ];

  results :any = [];

  onCancelPress(){
    this.router.navigate(['/master/pointCharge'])
  }

  filterCountry(e:any){
    this.results = this.data.filter((element) => element.name.toLowerCase().indexOf(e.query.toLowerCase()) !== -1)
  }

  onPressSave(){
    this.loadSpinner = true;
    if(this.pointChargeForm.valid){
    let data = {
      pointName: this.pointChargeForm.get('pointName')?.value,
      pointCharge: this.pointChargeForm.get('pointCharge')?.value,
      sameLocationCharge: this.pointChargeForm.get('sameLocationCharge')?.value,
      modifiedBy: '',
      status: this.pointChargeForm.get('status')?.value,
    }
     const apiCall = this.mode === 'create' ? this.pointChargeService.createPointCharge(this.locationId,data) : this.pointChargeService.updatePointCharge(this.locationId,this.pointChargeId, data);
    apiCall.subscribe((response: any) => {
      this.pointChargeData = response;
      this.mode=='edit'? this.toastr.success('Point Charge Updated Successfully'): this.toastr.success('Point Charge Created Successfully');
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


