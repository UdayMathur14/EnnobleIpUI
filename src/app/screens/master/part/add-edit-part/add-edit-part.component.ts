import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { PartDataModel } from '../../../../core/model/part.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-part',
  templateUrl: './add-edit-part.component.html',
  styleUrl: './add-edit-part.component.scss'
})
export class AddEditPartComponent implements OnInit {
  partForm: FormGroup;
  queryData: any;
  partData!: PartDataModel;
  partsList: any;
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private partService: PartService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private _Activatedroute: ActivatedRoute) {
    this.partForm = this.formBuilder.group({
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
    this.queryData = this._Activatedroute.snapshot.paramMap.get("partId");
    this.queryData = this.queryData == 0 ? '' : this.queryData;
    if (this.queryData != 0) {
      this.getPartData(this.queryData);
    }
    this.loadSpinner = false;
    // this.getAllPartsListInit();
  }

  //FETCHING SELECTED PART'S DATA FROM API
  getPartData(partId: string) {
    this.partService.getPartData(partId).subscribe((response: any) => {
      this.partForm.setValue({
        partNumber : response.partNumber,
        partName : response.partName,
        description : response.description,
        partSize : response.partSize,
        partPrice : response.partPrice,
        status : response.status,
        remarks : response.remarks
      });
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  // getAllPartsListInit() {
  //   let data = {
  //     "partNumber": ''
  //   }
  //   this.partService.getParts(data).subscribe((response: any) => {
  //     this.partsList = response.parts;
  //     this.loadSpinner = false;
  //   }, error => {
  //     this.toastr.error(error.statusText, error.status);
  //     this.loadSpinner = false;
  //   })
  // }

  //FUNCTION EXECUTED ON SAVE BUTTON CLICK
  onPressSave() {
    this.loadSpinner = true;
    let data = {
      partNumber: this.partForm.controls['partNumber'].value,
      partName: this.partForm.controls['partName'].value,
      description:this.partForm.controls['description'].value,
      partSize: this.partForm.controls['partSize'].value,
      remarks: this.partForm.controls['remarks'].value,
      partPrice: this.partForm.controls['partPrice'].value,
      status: this.partForm.controls['status'].value,
      modifiedBy: ""
    }
    if(this.queryData){
      this.updatePart(data);
    } else{
      this.createNewPart(data);
    }
  }

  //UPDATING PART DATA
  updatePart(data:any){
    this.partService.updatePart(this.queryData, data).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
      this.toastr.success('Part Updated Successfully');
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //CREATING NEW PART
  createNewPart(data:any){
    this.partService.createPart(data).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
      this.toastr.success('Part Created Successfully');
      this.router.navigate(['/master/part'])
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/part'])
  }
}