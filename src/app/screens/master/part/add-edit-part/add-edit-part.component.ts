import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { PartDataModel } from '../../../../core/model/masterModels.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant } from '../../../../core/constants';

@Component({
  selector: 'app-add-edit-part',
  templateUrl: './add-edit-part.component.html',
  styleUrl: './add-edit-part.component.scss'
})
export class AddEditPartComponent implements OnInit {
  partForm: FormGroup;
  partId: number = 0;
  partData!: PartDataModel;
  partsList: any;
  loadSpinner: boolean = false;
  locationsDropdownData: any = [];
  commonLocations: any[] = [];
  locations: any[] = APIConstant.commonLocationsList;
  locationCode: any;
  partLocationId: any;

  constructor(private router: Router,
    private partService: PartService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute) {
    this.partForm = this.formBuilder.group({
      locationId : ['', Validators.required],
      partNumber: ['', Validators.required],
      partName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      partSize: ['', [Validators.required]],
      partPrice: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      remarks: [''],
    });
  }

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
    this.setLocation();
    this.partId = Number(this.activatedRoute.snapshot.paramMap.get("partId"));
    this.partId = this.partId == 0 ? 0 : this.partId;
    if (this.partId != 0) {
      this.getAllPartsListInit()
    }
  }

  //FETCHING SELECTED PART'S DATA FROM API
  getPartData(partId: number) {
    this.loadSpinner = true;
    this.partService.getPartData(this.partLocationId, partId).subscribe((response: any) => {
      this.partForm.setValue({
        locationId: response?.locations?.code,
        partNumber: response.partNumber,
        partName: response.partName,
        description: response.description,
        partSize: response.partSize,
        partPrice: response.partPrice,
        status: response.status,
        remarks: response.remarks
      });
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const vehicle = this.partsList.filter((item: any) => {
        return item.id == this.partId
      });
      if (vehicle.length > 0) {
        this.partLocationId = vehicle[0].locations.id;
        resolve();
      } else {
        reject('No matching part found');
      }
    });
    
  }

  getAllPartsListInit() {
    let data = {
      "partNumber": '',
      "partName": '',
      "status": ''
    }
    this.partService.getParts(data).subscribe((response: any) => {
      this.partsList = response.parts;
      this.getLocationId().then(() => {
        this.getPartData(this.partId);
      });
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onPressSave() {
    this.loadSpinner = true;
    let data = {
      partNumber: this.partForm.controls['partNumber'].value,
      partName: this.partForm.controls['partName'].value,
      description: this.partForm.controls['description'].value,
      partSize: this.partForm.controls['partSize'].value,
      remarks: this.partForm.controls['remarks'].value,
      partPrice: Number(this.partForm.controls['partPrice'].value),
      status: this.partForm.controls['status'].value,
      modifiedBy: "",
      actionBy: localStorage.getItem("userId")
    }
    if (this.partId > 0) {
      this.updatePart(data);
    } else {
      this.createNewPart(data);
    }
  }

  //UPDATING PART DATA
  updatePart(data: any) {
    this.locationCode = this.partForm.controls['locationId']?.value;
    const matchedLocation = this.locations?.find((item: any) => item?.code == this.locationCode);
    const matchedLocationId = matchedLocation?.id;
    this.loadSpinner = true;
    this.partService.updatePart(matchedLocationId,this.partId, data).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
      this.toastr.success('Part Updated Successfully');
      this.router.navigate(['master/part']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
  }

  setLocation(){
    if(!this.partId){
      this.lookupService.setLocationId(this.partForm, this.commonLocations, 'locationId');
    }
    
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locationsDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active' && 
        this.commonLocations.some((location: any) => location.id === item.id));

    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
  }

  //CREATING NEW PART
  createNewPart(data: any) {
    this.locationCode = this.partForm.controls['locationId']?.value;
    this.loadSpinner = true;
    this.partService.createPart(this.locationCode,data).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
      this.toastr.success('Part Created Successfully');
      this.router.navigate(['/master/part'])
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/part'])
  }

  disableSave(){
    return !this.partForm.controls['partNumber'].value ||
    !this.partForm.controls['partName'].value || 
    !this.partForm.controls['partSize'].value || 
    !this.partForm.controls['partPrice'].value ||
    !this.partForm.controls['remarks'].value
  }
}