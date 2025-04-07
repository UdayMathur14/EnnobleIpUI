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
    bankCode: new FormControl(''),
    bankName: new FormControl(null),
    bankAddress1 :new FormControl(null),
    bankAddress2 :new FormControl(null),
    city :new FormControl(null),
    state :new FormControl(null),
    country :new FormControl(null),
    bankContactNo :new FormControl(null),
    bankEmailId :new FormControl(null),
    bankBranch :new FormControl(null),
    ifscCode :new FormControl(null),
    accountNumber :new FormControl(null),
    accountHolderName :new FormControl(null),
    accountType: new FormControl(null),
    status: new FormControl(''),
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
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  patchTransactionForm(data: any) {
    this.transactionTypeForm.patchValue({
      bankCode: data?.bankCode,
      bankName: data?.bankName,
      bankAddress1: data?.bankAddress1,
      bankAddress2: data?.bankAddress2,
      city: data?.city,
      state: data?.state,
      country: data?.country,
      bankContactNo: data?.bankContactNo,
      bankEmailId: data?.bankEmailId,
      bankBranch: data?.bankBranch,
      ifscCode: data?.ifscCode,
      accountNumber: data?.accountNumber,
      accountHolderName: data?.accountHolderName,
      accountType: data?.accountType,
      status: data.status
    });
  }

  onPressSave() {
    this.loadSpinner = true;
    const data = {
  bankCode: this.transactionTypeForm.controls['bankCode']?.value,
  bankName: this.transactionTypeForm.controls['bankName']?.value,
  bankAddress1: this.transactionTypeForm.controls['bankAddress1']?.value,
  bankAddress2: this.transactionTypeForm.controls['bankAddress2']?.value,
  city: this.transactionTypeForm.controls['city']?.value,
  state: this.transactionTypeForm.controls['state']?.value,
  country: this.transactionTypeForm.controls['country']?.value,
  bankContactNo: this.transactionTypeForm.controls['bankContactNo']?.value,
  bankEmailId: this.transactionTypeForm.controls['bankEmailId']?.value,
  bankBranch: this.transactionTypeForm.controls['bankBranch']?.value,
  ifscCode: this.transactionTypeForm.controls['ifscCode']?.value,
  accountNumber: this.transactionTypeForm.controls['accountNumber']?.value,
  accountHolderName: this.transactionTypeForm.controls['accountHolderName']?.value,
  accountType: this.transactionTypeForm.controls['accountType']?.value,
  status: this.transactionTypeForm.controls['status']?.value,
  actionBy: localStorage.getItem("userId")
};

    this.transactionTypesService.updateTransaction(this.queryData, data).subscribe((response: any) => {
      this.transactionData = response;
      this.loadSpinner = false;
      this.toastr.success('Transaction Updated Successfully');
      this.router.navigate(['/master/transactionTypes']);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
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
      this.glSubcategoryCode = res.lookUps.filter(
        (item: any) => item.status === 'Active');
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
