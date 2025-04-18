import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupTypeService } from '../../../../core/service/lookupType.service';
import { LookupTypeDataModel } from '../../../../core/model/masterModels.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-lookupType',
  templateUrl: './add-edit-lookupType.component.html',
  styleUrl: './add-edit-lookupType.component.scss'
})
export class AddEditLookupTypeComponent implements OnInit {
  LookupTypeForm: FormGroup;
  LookupTypeData!: LookupTypeDataModel;
  LookupTypeId: number = 0;
  filledDetails: any;
  loadSpinner: boolean = true;
  LookupTypes: any;
  showFilledDetails: boolean = false;
  selectedLookupType: any;

  constructor(
    private router: Router,
    private LookupTypeService: LookupTypeService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.LookupTypeForm = this.formBuilder.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Active', Validators.required],
    })
  }

  ngOnInit(): void {
    this.LookupTypeId = Number(this.activatedRoute.snapshot.paramMap.get("lookupTypeId"));
    console.log(this.LookupTypeId);
    this.LookupTypeId = this.LookupTypeId == 0 ? 0 : this.LookupTypeId;
    if (this.LookupTypeId != 0) {
      this.getLookupTypeData(this.LookupTypeId);
    } else {
      this.getLookupType();
    }
  }

  getLookupType() {
    let data = {
      type:""
    };
    this.LookupTypeService.getLookupTypeDrop(data).subscribe((response: any) => {
      if(this.LookupTypeId == 0){
        this.LookupTypes = response.LookupTypes;
        console.log("uday");
      }
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    });
  }
  

  //TO GET SELECTED LookupType DATA
  getLookupTypeData(LookupTypeId: number) {
    this.LookupTypeService.getLookupTypeDatas(LookupTypeId).subscribe((response: any) => {
      this.selectedLookupType = response;
      this.LookupTypeForm.patchValue({
        type: response.type,
        description: response.description,
        status: response.status
      });

      this.LookupTypes = [response.LookupTypeType];
      this.selectedLookupType = response?.LookupTypeType?.value
      
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    });
  }

  //FUNCTION EXECUTED ON SUBMIT BUTTON CLICK
  onPressSubmit() {
    this.loadSpinner = true;
    let data = {
      type: (this.LookupTypeForm.controls['type'].value),
      description: this.LookupTypeForm.controls['description'].value,
      status: this.LookupTypeForm.controls['status'].value,
      actionBy: ""
    }
    if (this.LookupTypeId > 0) {
      this.updateLookupType(data);
    } else {
      this.createNewLookupType(data);
    }
  }

  //UPDATING LookupType DATA
  updateLookupType(data: any) {
    this.LookupTypeService.updateLookup(this.LookupTypeId, data).subscribe((response: any) => {
      this.LookupTypeData = response;
      this.loadSpinner = false;
      this.toastr.success('LookupType Updated Successfully');
      this.router.navigate(['/master/LookupType']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //CREATE NEW LookupType
  createNewLookupType(data: any) {
    this.LookupTypeService.createLookup(data).subscribe((response: any) => {
      this.LookupTypeData = response;
      this.loadSpinner = false;
      this.toastr.success('LookupType Created Successfully');
      this.router.navigate(['/master/lookupType']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //PREVIEW OF UPDATED AND CREATED DATA ON SAVE BUTTON CLICK
  onSaveButtonClick() {
    this.updateFilledDetails();
    this.showFilledDetails = true;
  }

  //EXECUTED ON SAVE BUTTON CLICK TO SHOW DATA PREVIEW
  updateFilledDetails() {
    const typeId = this.LookupTypeForm.controls['typeId'].value;
    const LookupTypeType = this.LookupTypes.find((type: any) => type.id === typeId);

    this.filledDetails = {
      typeId: LookupTypeType ? LookupTypeType.type : '',
      code: this.LookupTypeForm.controls['code'].value,
      value: this.LookupTypeForm.controls['value'].value,
      description: this.LookupTypeForm.controls['description'].value,
      status: this.LookupTypeForm.controls['status'].value
    };
  }

  onCancelPress() {
    this.router.navigate(['/master/lookupType'])
  }

  selecetLookupType(e: any){
      this.selectedLookupType = e?.target?.innerText
  }

}