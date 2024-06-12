import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../../../core/service';
import { ToastrService } from 'ngx-toastr';
import { PlantDataModel } from '../../../../core/model/masterModels.model';
import { BaseService } from '../../../../core/service/base.service';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '../../../../core/service/lookup.service';

@Component({
  selector: 'app-add-edit-plant',
  templateUrl: './add-edit-plant.component.html',
  styleUrl: './add-edit-plant.component.scss'
})

export class AddEditPlantComponent implements OnInit {
  plantForm: FormGroup;
  queryData: any;
  plantData!: PlantDataModel;
  plantsList: any = [];
  transactionTypesList: any = [];
  locationsDropdownData: any = [];
  selectedTransactionCodes: string[] = [];
  deletedTransactions: any[] = [];
  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private plantService: PlantService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private baseService: BaseService,
    private transactionService: TransactionTypesService,
    private lookupService: LookupService,
  ) {
    this.plantForm = this.formBuilder.group({
      plantCode: [''],
      plantDesc: [''],
      plantAddress: [''],
      city: [''],
      stateCode: [''],
      gstnNo: [''],
      panNo: [''],
      plantType: [''],
      siteCode: [''],
      locationId: [''],
      dsc: [''],
      dcp: [''],
      status: ['Active']
    });
  }

  ngOnInit(): void {
    this.baseService.plantSpinner.next(true);
    this.queryData = this._Activatedroute.snapshot.paramMap.get("plantId");
    this.getPlantData(this.queryData);
    this.getTransactionTypes();
    this.getLocations();
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locationsDropdownData = res.lookUps;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    });
  }

  getPlantData(plantId: string) {
    this.plantService.getPlantData(plantId).subscribe((response: any) => {
      this.plantForm.setValue({
        plantCode: response.plantCode,
        plantDesc: response.plantDesc,
        plantAddress: response.plantAddress,
        city: response.city.value,
        stateCode: response.state.value,
        gstnNo: response.gstnNo,
        panNo: response.panNo,
        plantType: response.plantType,
        siteCode: response.siteCode,
        locationId: response.locations.value,
        dsc: response.dsc,
        dcp: response.dcp,
        status: response.status,
      });
      this.plantData = response;
      this.initializeSelectedTransactionCodes();
      this.baseService.plantSpinner.next(false);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    })
  }

  getTransactionTypes() {
    let data = {
      "code": ''
    }
    this.transactionService.getTransactionTypes(data).subscribe((response: any) => {
      this.transactionTypesList = response.transactionTypes
    }, error => {

    })
  }

  onCancelPress() {
    this.router.navigate(['/master/plant'])
  }

  onPressSave() {
    this.baseService.plantSpinner.next(true);
    let transactionData: { id: number; transactionTypeId: number; status: string; }[] = [];
    this.plantData.transactionTypeMapping.forEach((e) => {
      let transactionObj = {
        id: e.id,
        transactionTypeId: e.transactionTypeId,
        status: e.status
      }
      transactionData.push(transactionObj);
    })

    this.deletedTransactions.forEach(transaction => {
      transaction.status = 'Inactive';
    });

    transactionData = [...transactionData, ...this.deletedTransactions];
    let data = {
      status: this.plantForm.controls['status'].value,
      actionBy: 1,
      locationId: (this.plantForm.controls['locationId'].value) || 0,
      dsc: this.plantForm.controls['dsc'].value,
      dcp: this.plantForm.controls['dcp'].value,
      transactionTypeDetails: transactionData
    }
    this.plantService.updatePlant(this.queryData, data).subscribe((response: any) => {
      this.plantData = response;
      this.toastr.success('Plant Update Successfully');
        
      this.baseService.plantSpinner.next(false);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    })
  }

  onAddTransactionRow() {
    let obj = {
      id: 0,
      status: '',
      attribute1: null,
      attribute2: null,
      attribute3: null,
      attribute4: null,
      txnTypeId: null,
      name: '',
      code: null,
      transactionTypeId: 0
    }
    this.plantData.transactionTypeMapping.push(obj);
  }

  onTransactionSelect(e: any, index: any) {
    this.plantData.transactionTypeMapping[index].name = e.name;
    this.plantData.transactionTypeMapping[index].status = e.status;
    this.plantData.transactionTypeMapping[index].code = e.code;
    this.plantData.transactionTypeMapping[index].transactionTypeId = e.id

    this.updateSelectedTransactionCodes();
  }

  getFilteredTransactionTypes(index: number): any[] {
    return this.transactionTypesList.filter(
      (transaction: any) =>
        !this.selectedTransactionCodes.includes(transaction.code) ||
        this.plantData.transactionTypeMapping[index].code === transaction.code
    );
  }

  initializeSelectedTransactionCodes() {
    this.selectedTransactionCodes = this.plantData.transactionTypeMapping
      .filter((transaction) => transaction.code)
      .map((transaction) => transaction.code);
  }

  updateSelectedTransactionCodes() {
    this.selectedTransactionCodes = this.plantData.transactionTypeMapping
      .filter((transaction) => transaction.code)
      .map((transaction) => transaction.code);
  }

  onDeleteTransaction(transaction: any, index: number) {
    const deletedTransaction = {
      id: transaction.id,
      transactionTypeId: transaction.transactionTypeId,
      status: 'Inactive'
    };
    if (deletedTransaction.id != 0) {
      this.deletedTransactions.push(deletedTransaction);
    }
    this.plantData.transactionTypeMapping.splice(index, 1);
  }
}