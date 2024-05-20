import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LookupTypeService } from '../../../../core/service/lookup-type.service';
import { LookupTypeDataModel } from '../../../../core/model/masterModels.model';

@Component({
  selector: 'app-add-edit-lookup-type',
  templateUrl: './add-edit-lookup-type.component.html',
  styleUrl: './add-edit-lookup-type.component.scss'
})
export class AddEditLookupTypeComponent {
  lookupTypeForm: FormGroup;
  lookupData!: LookupTypeDataModel;
  lookuptypeId: number = 0;
  filledDetails: any;
  loadSpinner: boolean = true;
  lookupTypes: any;
  showFilledDetails: boolean = false;

  constructor(
    private router: Router,
    private lookupTypeService: LookupTypeService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.lookupTypeForm = this.formBuilder.group({
      type: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Active', Validators.required],
      attribute1: ['', Validators.required],
      attribute2: ['', Validators.required],
      attribute3: ['', Validators.required],
      attribute4: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    this.lookuptypeId = Number(this.activatedRoute.snapshot.paramMap.get("lookupTypeId"));
    this.lookuptypeId = this.lookuptypeId == 0 ? 0 : this.lookuptypeId;
    if (this.lookuptypeId != 0) {
      this.getLookupTypeData(this.lookuptypeId);
    }
    this.loadSpinner = false;
  }

  //TO GET SELECTED LOOKUP-TYPE DATA
  getLookupTypeData(lookupTypeId: number) {
    this.lookupTypeService.getLookupTypesData(lookupTypeId).subscribe((response: any) => {
      this.lookupTypeForm.setValue({
        type: response.type,
        description: response.description,
        status: response.status,
        attribute1: response.attribute1,
        attribute2: response.attribute2,
        attribute3: response.attribute3,
        attribute4: response.attribute4,
      });
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
      this.loadSpinner = false;
    });
  }

  //FUNCTION EXECUTED ON SUBMIT BUTTON CLICK
  onPressSubmit() {
    this.loadSpinner = true;
    let data = {
      type: this.lookupTypeForm.controls['type'].value,
      description: this.lookupTypeForm.controls['description'].value,
      status: this.lookupTypeForm.controls['status'].value,
      attribute1: this.lookupTypeForm.controls['attribute1'].value,
      attribute2: this.lookupTypeForm.controls['attribute2'].value,
      attribute3: this.lookupTypeForm.controls['attribute3'].value,
      attribute4: this.lookupTypeForm.controls['attribute4'].value,
    }
    if (this.lookuptypeId>0) {
      this.updateLookupType(data);
    } else {
      this.createNewLookupType(data);
    }
  }

  //UPDATING LOOKUP TYPE DATA
  updateLookupType(data: any) {
    this.lookupTypeService.updateLookupTypes(this.lookuptypeId, data).subscribe((response: any) => {
      this.lookupData = response;
      this.loadSpinner = false;
      this.toastr.success('Lookup Updated Successfully')
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
      this.loadSpinner = false;
    })
  }

  //CREATING NEW LOOKUP TYPE
  createNewLookupType(data: any) {
    this.lookupTypeService.createLookupTypes(data).subscribe((response: any) => {
      this.lookupData = response;
      this.loadSpinner = false;
      this.toastr.success('Lookup Type Created Successfully');
      this.router.navigate(['/master/lookupType']);
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join(', '));
      this.loadSpinner = false;
    })
  }

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onSaveButtonClick() {
    this.updateFilledDetails();
    this.showFilledDetails = true;
  }

  //FUNCTON TO PREVIEW THE TABLE DATA IN FILLED DETAIL SECTION
  updateFilledDetails() {
    this.filledDetails = this.lookupTypeForm.value;
  }

  //NAVIGATE TO LOOKUP-TYPE LISTING ON CANCEL BUTTON CLICK
  onCancelPress() {
    this.router.navigate(['/master/lookupType'])
  }

}
