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
  locationCode: string = '';
  constructor(private router: Router,
    private _Activatedroute: ActivatedRoute,
    private adviceService : AdviceTypeService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { 
    this.adviceForm = this.formBuilder.group({
      adviceType: ['', [Validators.required]],
      batchName: ['', [Validators.required]],
      maxBiltiLimit: ['', [Validators.required]],
      manualAllocReq: ['Yes', [Validators.required]],
      status: ['Active', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("adviceId");
    this.queryData = this.queryData == 0 ? '' : this.queryData;
    if (this.queryData != 0) {
      this.getAdviceTypeData(this.queryData);
    }
    this.loadSpinner = false;
       // Enable or disable status control based on queryData for Create and Update
       const statusControl = this.adviceForm.get('status');
       if(statusControl){
         if(this.queryData == 0){
           statusControl.disable()
         }
       }
  }

  getAdviceTypeData(adviceId : string){
    this.adviceService.getAdviceTypeData(adviceId).subscribe((response: any) => {
      this.locationCode = response.lookUpEntity.value
      this.adviceForm.setValue({
        adviceType : response.adviceType,
        batchName : response.batchName,
        maxBiltiLimit : response.maxBiltiNumber,
        manualAllocReq : response.manualAllocationRequired,
        status: response.status
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
        adviceType: this.adviceForm.controls['adviceType']?.value,
        batchName:this.adviceForm.controls['batchName']?.value,
        maxBiltiNumber: this.adviceForm.controls['maxBiltiLimit']?.value,
        manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
        status: this.adviceForm.controls['status']?.value,
        actionBy: 1
      }
      let editData = {
        adviceType: this.adviceForm.controls['adviceType']?.value,
        maxBiltiNumber: this.adviceForm.controls['maxBiltiLimit']?.value,
        manualAllocationRequired: this.adviceForm.controls['manualAllocReq']?.value,
        status: this.adviceForm.controls['status']?.value,
        actionBy: 1
      }
      if(this.queryData){
        this.updateAdviceType(editData);
      } else{
        this.createNewAdvice(data);
      }
    }
  
    //UPDATING PART DATA
    updateAdviceType(data:any){
        this.adviceService.updateAdviceType(this.queryData, data).subscribe((response: any) => {
          this.adviceForm.setValue({
            adviceType : response.adviceType,
            batchName : response.batchName,
            maxBiltiLimit : response.maxBiltiNumber,
            manualAllocReq : response.manualAllocationRequired,
            status: response.status
          });
          this.loadSpinner = false;
          this.toastr.success('Advice Type Updated Successfully');
          this.router.navigate(['/master/advice'])
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
