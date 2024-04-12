import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { ToastrService } from 'ngx-toastr';
import { TransactionTypeListModel } from '../../../../core/model/masterModels.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-transaction-type',
  templateUrl: './add-edit-transaction-type.component.html',
  styleUrl: './add-edit-transaction-type.component.scss'
})
export class AddEditTransactionTypeComponent implements OnInit {
  constructor(private router: Router,
    private transactionTypesService : TransactionTypesService,
    private toastr : ToastrService,
    private _Activatedroute : ActivatedRoute) {}

  queryData : any = '';
  transactionTypeForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl(null, [Validators.required]),
    glSubcategory: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });
  loadSpinner : boolean = true;
  glSubcategoryCode: any = [];
  transactionData: any = []

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("transactionId");   
    this.getTransactionData(this.queryData);
    this.getGlSubCategoryDropdownData()
  }

  getTransactionData(transactionId: string) {
    this.transactionTypesService.getTransactionTypeData(transactionId).subscribe((response: any) => {
      this.patchVehicleForm(response)
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  patchVehicleForm(data: any){
    console.log(data)
    this.transactionTypeForm.patchValue({
      code: data?.code,
      name: data?.name,
      glSubcategory: data.glSubCategory.id,
      status: data.status
    });
  }

  onPressSave(){
    this.loadSpinner = true;
    let data = {
      code: this.transactionTypeForm.get('code')?.value,
      name: this.transactionTypeForm.get('name')?.value,
      interfaceTxnTypeId: 0,
      glSubCategoryId:  this.transactionTypeForm.get('glSubcategory')?.value ,
      status: this.transactionTypeForm.get('status')?.value,
      actionBy: 1
    }
    this.transactionTypesService.updateTransaction(this.queryData, data).subscribe((response: any) => {
      this.transactionData = response;
      this.loadSpinner = false;
      this.toastr.success('Transaction Updated Successfully');
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onCancelPress(){
    this.router.navigate(['/master/transactionTypes'])
  }

  getGlSubCategoryDropdownData(){
    let data = {
      "CreatedOn": "",
      "ModifiedBy": "",
      "ModifiedOn": ""
    }
    const type = 'GLSubCategory'
    this.transactionTypesService.getDropdownData(data, type).subscribe((res:any)=>{
      this.glSubcategoryCode = res.lookUps
    })
  }
  
}
