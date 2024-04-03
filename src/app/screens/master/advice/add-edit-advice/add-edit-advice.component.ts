import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdviceTypeService } from '../../../../core/service/adviceType.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-advice',
  templateUrl: './add-edit-advice.component.html',
  styleUrl: './add-edit-advice.component.scss'
})
export class AddEditAdviceComponent implements OnInit {
  adviceForm : FormGroup
  queryData : any = '';
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private _Activatedroute: ActivatedRoute,
    private adviceService : AdviceTypeService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { 
    this.adviceForm = this.formBuilder.group({
      locationCode: ['', Validators.required],
      adviceType: ['', [Validators.required]],
      batchName: ['', [Validators.required]],
      maxBiltiLimit: ['', [Validators.required]],
      manualAllocReq: ['Yes', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("adviceId");
    this.queryData = this.queryData == 0 ? '' : this.queryData;
    if (this.queryData != 0) {
      this.getAdviceTypeData(this.queryData);
    }
    this.loadSpinner = false;
  }

  getAdviceTypeData(adviceId : string){
    this.adviceService.getAdviceTypeData(adviceId).subscribe((response: any) => {
      this.adviceForm.setValue({
        locationCode : response.locationCode,
        adviceType : response.adviceType,
        batchName : response.batchName,
        maxBiltiLimit : response.maxBiltiNumber,
        manualAllocReq : response.manualAllocationRequired,
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
        locationCode: this.adviceForm.controls['locationCode'].value,
        adviceType: this.adviceForm.controls['adviceType'].value,
        // batchName:this.adviceForm.controls['batchName'].value,
        maxBiltiNumber: this.adviceForm.controls['maxBiltiLimit'].value,
        manualAllocationRequired: this.adviceForm.controls['manualAllocReq'].value,
      }
      if(this.queryData){
        this.updateAdviceType(data);
      } else{
        this.createNewAdvice(data);
      }
    }
  
    //UPDATING PART DATA
    updateAdviceType(data:any){
      this.adviceService.updateAdviceType(this.queryData, data).subscribe((response: any) => {
        this.adviceForm.setValue({
          locationCode : response.locationCode,
          adviceType : response.adviceType,
          batchName : response.batchName,
          maxBiltiLimit : response.maxBiltiNumber,
          manualAllocReq : response.manualAllocationRequired,
        });
        this.loadSpinner = false;
        this.toastr.success('Advice Type Updated Successfully');
      }, error => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      })
    }
  
    //CREATING NEW PART
    createNewAdvice(data:any){
      this.adviceService.createAdviceType(data).subscribe((response: any) => {
        this.loadSpinner = false;
        this.toastr.success('Advice Type Created Successfully');
        this.router.navigate(['/master/advice'])
      }, error => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      })
    }

  onCancelPress() {
    this.router.navigate(['/master/advice'])
  }
}
