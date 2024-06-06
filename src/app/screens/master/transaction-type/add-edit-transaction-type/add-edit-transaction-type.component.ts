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

  queryData: any = '';
  transactionTypeForm = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(null),
    glSubcategory: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    transactionTypeInterface: new FormControl('', [Validators.required]),
  });
  loadSpinner: boolean = true;
  glSubcategoryCode: any = [];
  transactionData: any = [];
  transactionTypeInterfaceData: any = [];

  constructor(
    private router: Router,
    private transactionTypesService: TransactionTypesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.queryData = this.activatedRoute.snapshot.paramMap.get("transactionId");
    this.getTransactionData(this.queryData);
    this.getGlSubCategoryDropdownData();
    this.getTransactionTypeInterfaceDropdownData();
  }

  getTransactionData(transactionId: string) {
    this.transactionTypesService.getTransactionTypeData(transactionId).subscribe((response: any) => {
      this.patchTransactionForm(response)
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  patchTransactionForm(data: any) {
    this.transactionTypeForm.patchValue({
      code: data?.code,
      name: data?.name,
      glSubcategory: data.glSubCategory.id,
      status: data.status,
      transactionTypeInterface: data.iTransactionTypeId
    });
  }

  onPressSave() {
    this.loadSpinner = true;
    const data = {
      code: this.transactionTypeForm.controls['code']?.value,
      name: this.transactionTypeForm.controls['name']?.value,
      interfaceTxnTypeId: (this.transactionTypeForm.controls['transactionTypeInterface']?.value) || 0,
      glSubCategoryId: (this.transactionTypeForm.controls['glSubcategory']?.value) || 0,
      status: this.transactionTypeForm.controls['status']?.value,
      actionBy: 1
    }
    this.transactionTypesService.updateTransaction(this.queryData, data).subscribe((response: any) => {
      this.transactionData = response;
      this.loadSpinner = false;
      this.toastr.success('Transaction Updated Successfully');
      this.router.navigate(['/master/transactionTypes']);
    }, error => {
      this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/transactionTypes'])
  }

  getGlSubCategoryDropdownData() {
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'GLSubCategory'
    this.transactionTypesService.getDropdownData(data, type).subscribe((res: any) => {
      this.glSubcategoryCode = res.lookUps
    })
  }

  getTransactionTypeInterfaceDropdownData() {
    const data = {
      "code": "",
      "name": ""
    }
    this.transactionTypesService.getTransactionTypeInterface(data).subscribe((res: any) => {
      this.transactionTypeInterfaceData = res.transactionTypeInterfaces

    })
  }

}
