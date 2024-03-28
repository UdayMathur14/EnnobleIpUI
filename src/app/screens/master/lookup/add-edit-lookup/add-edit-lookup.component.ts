import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../core/service/base.service';
import { LookupService } from '../../../../core/service/lookup.service';
import { LookupDataModel } from '../../../../core/model/lookup.model';

@Component({
  selector: 'app-add-edit-lookup',
  templateUrl: './add-edit-lookup.component.html',
  styleUrl: './add-edit-lookup.component.scss'
})
export class AddEditLookupComponent implements OnInit {

  constructor(private router: Router,
    private _route: ActivatedRoute,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private baseService : BaseService){}
    mode:any = 'create';
    lookupId:any;
    lookupData:LookupDataModel = {
      code: '',
      value: '',
      description: '',
      status: '',
      attribute1: '',
      attribute2: '',
      attribute3: '',
      attribute4: '',
      createdBy: '',
      createdOn: '',
      modifiedBy: '',
      modifiedOn: '',
      messageStatus: '',
      lookUpType:{
        type: ''
      }
    };
    lookupsTypeList:any;

  ngOnInit(): void {
    // this.baseService.pointChargeSpinner.next(true);
    this._route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.has('lookupId')){
        this.mode = 'edit';
        this.lookupId = paramMap.get('lookupId')
      }else {
        this.mode = 'create';
        this.lookupId = null;
      } 
    })  
    this.getLookupData(this.lookupId);
    this.getLookupsTypeData()
  }

  getLookupData(lookupId: string) {
    if(this.mode == 'edit'){
      this.baseService.lookupSpinner.next(true);
      this.lookupService.getLookupData(lookupId).subscribe((response: any) => {
        this.lookupData = response;
        this.baseService.lookupSpinner.next(false);
      }, error => {
        this.toastr.error(error.statusText, error.status);
        this.baseService.lookupSpinner.next(false);
      })
    }
    
  }

  getLookupsTypeData() {
    let data = {
      "type": ''
    }
    this.lookupService.getLookupsType(data).subscribe((response: any) => {
      console.log(response)
      this.lookupsTypeList = response.lookUpTypes;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/lookup'])
  }

  onPressSubmit(){
    this.baseService.lookupSpinner.next(true);
    let data = {
      // locationId: this.lookupData.locationId,
      // pointName: this.lookupData.pointName,
      // pointCharge: this.lookupData.pointCharge,
      // sameLocationCharge: this.lookupData.sameLocationCharge,
      // modifiedBy: '',
      // status: this.lookupData.status
    }
     const apiCall = this.mode === 'create' ? this.lookupService.createLookup(data) : this.lookupService.updateLookup(this.lookupId, data);
    apiCall.subscribe((response: any) => {
      this.lookupData = response;
      this.mode === 'create' ? this.toastr.success('Lookup Created Successfully'): this.toastr.success('Lookup Updated Successfully');
      this.baseService.lookupSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.lookupSpinner.next(false);
    })
  }
  

}
