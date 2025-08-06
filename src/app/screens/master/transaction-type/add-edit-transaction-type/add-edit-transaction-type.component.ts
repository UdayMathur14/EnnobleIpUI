import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../../../core/service/country.service';

@Component({
  selector: 'app-add-edit-transaction-type',
  templateUrl: './add-edit-transaction-type.component.html',
  styleUrl: './add-edit-transaction-type.component.scss',
})
export class AddEditTransactionTypeComponent implements OnInit {
  queryData: any = '';
  transactionTypeForm = new FormGroup({
    bankName: new FormControl('', Validators.required),
    bankAddress1: new FormControl('', Validators.required),
    bankAddress2: new FormControl(null),
    city: new FormControl(null),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    bankContactNo: new FormControl(null),
    bankEmailId: new FormControl(null),
    bankBranch: new FormControl('', Validators.required),
    ifscCode: new FormControl('', [
      Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/),
    ]),
     accountNumber: new FormControl('', [
  Validators.required,
  Validators.pattern('^[1-9][0-9]{8,17}$') // starts with 1-9, then 8 to 17 digits
]),
    accountHolderName: new FormControl('', Validators.required),
    accountType: new FormControl('', Validators.required),
    status: new FormControl(''),
  });

  countryList: any = [];
  loadSpinner: boolean = true;
  glSubcategoryCode: any = [];
  transactionData: any = [];
  transactionTypeInterfaceData: any = [];
  bankId: any;
  constructor(
    private router: Router,
    private transactionTypesService: TransactionTypesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.queryData = this.activatedRoute.snapshot.paramMap.get('bankId');
    // this.bankId = this.bankId == 0 ? 0 : this.bankId;
    this.bankId =
      Number(this.activatedRoute.snapshot.paramMap.get('bankId')) || 0;
    this.AllcountryList();
    this.getTransactionData(this.queryData);
    // this.getGlSubCategoryDropdownData();
    // this.getTransactionTypeInterfaceDropdownData();
  }

  getTransactionData(transactionId: string) {
    this.transactionTypesService
      .getTransactionTypeData(transactionId)
      .subscribe(
        (response: any) => {
          this.patchTransactionForm(response);
          this.loadSpinner = false;
        },
        (error) => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
  }
  AllcountryList() {
    var data = {};
    this.countryService.getCountryData(data).subscribe(
      (response: any) => {
        this.countryList = response.countrys;
        console.log(this.countryList);
        this.loadSpinner = false;
      },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  patchTransactionForm(data: any) {
    this.transactionTypeForm.patchValue({
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
      status: data.status,
    });
  }

  onPressSave() {
    this.loadSpinner = true;
    const data = {
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
      accountHolderName:
        this.transactionTypeForm.controls['accountHolderName']?.value,
      accountType: this.transactionTypeForm.controls['accountType']?.value,
      status: this.transactionTypeForm.controls['status']?.value,
      actionBy: '',
    };

    if (this.bankId == 0) {
      this.loadSpinner = true;
      this.transactionTypesService.createBankId(data).subscribe(
        (response: any) => {
          this.transactionTypeInterfaceData = response;
          this.loadSpinner = false;
          this.toastr.success('Bank Created Successfully');
          this.router.navigate(['/master/bank']);
        },
        () => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
    } else {
      this.transactionTypesService
        .updateTransaction(this.queryData, data)
        .subscribe(
          (response: any) => {
            this.transactionData = response;
            this.loadSpinner = false;
            this.toastr.success('Transaction Updated Successfully');
            this.router.navigate(['/master/bank']);
          },
          (error) => {
            //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
            this.loadSpinner = false;
          }
        );
    }
  }

  onCancelPress() {
    this.router.navigate(['/master/bank']);
  }

  getGlSubCategoryDropdownData() {
    const data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'GLSubCategory';
    this.transactionTypesService
      .getDropdownData(data, type)
      .subscribe((res: any) => {
        this.glSubcategoryCode = res.lookUps.filter(
          (item: any) => item.status === 'Active'
        );
      });
  }

  getTransactionTypeInterfaceDropdownData() {
    const data = {
      code: '',
      name: '',
    };
    this.transactionTypesService
      .getTransactionTypeInterface(data)
      .subscribe((res: any) => {
        this.transactionTypeInterfaceData = res.transactionTypeInterfaces;
      });
  }
}
