import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { ToastrService } from 'ngx-toastr';

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
  transactionData : any;
  loadSpinner : boolean = true;

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("transactionId");   
    this.getTransactionData(this.queryData);
  }

  getTransactionData(transactionId: string) {
    this.transactionTypesService.getTransactionTypeData(transactionId).subscribe((response: any) => {
      this.transactionData = response;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onPressSave(){
    this.loadSpinner = true;
    let data = {
      code: this.transactionData.code,
      name: this.transactionData.name,
      interfaceTxnTypeId: 0,
      glSubCategoryId: 0,
      status: this.transactionData.status,
      attribute1: "",
      attribute2: "",
      attribute3: "",
      attribute4: "",
      actionBy: 1
    }
    this.transactionTypesService.updateTransaction(this.queryData, data).subscribe((response: any) => {
      this.transactionData = response;
      this.loadSpinner = false;
      this.toastr.success('Transaction Updated Successfully');
      this.router.navigate(['/master/transactionTypes'])
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onCancelPress(){
    this.router.navigate(['/master/transactionTypes'])
  }
}
