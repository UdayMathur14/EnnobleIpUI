import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartService } from '../../../../core/service/part.service';
import { PartDataModel } from '../../../../core/model/masterModels.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private partService: PartService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute) {
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
    this.partId = Number(this.activatedRoute.snapshot.paramMap.get("partId"));
    this.partId = this.partId == 0 ? 0 : this.partId;
    if (this.partId != 0) {
      this.getPartData(this.partId);
    }
    this.loadSpinner = false;
  }

  //FETCHING SELECTED PART'S DATA FROM API
  getPartData(partId: number) {
    this.partService.getPartData(partId).subscribe((response: any) => {
      this.partForm.setValue({
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
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
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
      description: this.partForm.controls['description'].value,
      partSize: this.partForm.controls['partSize'].value,
      remarks: this.partForm.controls['remarks'].value,
      partPrice: Number(this.partForm.controls['partPrice'].value),
      status: this.partForm.controls['status'].value,
      modifiedBy: ""
    }
    if (this.partId>0) {
      this.updatePart(data);
    } else {
      this.createNewPart(data);
    }
  }

  //UPDATING PART DATA
  updatePart(data: any) {
    this.partService.updatePart(this.partId, data).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
      this.toastr.success('Part Updated Successfully');
      this.router.navigate(['master/part']);
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //CREATING NEW PART
  createNewPart(data: any) {
    this.partService.createPart(data).subscribe((response: any) => {
      this.partData = response;
      this.loadSpinner = false;
      this.toastr.success('Part Created Successfully');
      this.router.navigate(['/master/part'])
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/part'])
  }
}