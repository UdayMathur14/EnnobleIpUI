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

  constructor(
    private router: Router,
    private _Activatedroute: ActivatedRoute,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private baseService: BaseService
  ) { }

  lookupId: any;
  lookupData!: LookupDataModel;
  queryData: any;
  filledDetails: any;

  ngOnInit(): void {
    this.baseService.lookupSpinner.next(true);
    this.queryData = this._Activatedroute.snapshot.paramMap.get("lookupId");
    this.getLookupData(this.queryData);
  }

  getLookupData(lookupId: string) {
    this.lookupService.getLookupData(lookupId).subscribe((response: any) => {
      console.log(response);
      this.lookupData = response;
      this.baseService.lookupSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.lookupSpinner.next(false);
    })
  }

  onPressSubmit() {
    this.baseService.lookupSpinner.next(true);
    let data = {
      typeId: this.lookupData.lookUpType.id,
      code: this.lookupData.code,
      value: this.lookupData.value,
      description: this.lookupData.description,
      status: this.lookupData.status,
      attribute1: this.lookupData.attribute1,
      attribute2: this.lookupData.attribute2,
      attribute3: this.lookupData.attribute3,
      attribute4: this.lookupData.attribute4
    }
    this.lookupService.updateLookup(this.queryData, data).subscribe((response: any) => {
      this.lookupData = response;
      this.toastr.success("Lookup Update Successfully");
      this.baseService.lookupSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.vendorSpinner.next(false);
    })
  }

  onSaveButtonClick() {
    this.filledDetails = {
      type: this.lookupData.lookUpType.type,
      code: this.lookupData.code,
      value: this.lookupData.value,
      description: this.lookupData.description,
      status: this.lookupData.status,
      attribute1: this.lookupData.attribute1,
      attribute2: this.lookupData.attribute2,
      attribute3: this.lookupData.attribute3,
      attribute4: this.lookupData.attribute4
    };
  }

  onCancelPress() {
    this.router.navigate(['/master/lookup'])
  }

}