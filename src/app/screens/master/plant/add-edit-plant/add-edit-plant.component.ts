import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../../../core/service';
import { ToastrService } from 'ngx-toastr';
import { PlantDataModel } from '../../../../core/model/masterModels.model';
import { BaseService } from '../../../../core/service/base.service';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LookupService } from '../../../../core/service/lookup.service';
import { APIConstant } from '../../../../core/constants';

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
  profitCenterDropdownData: any = [];
  businessPlaceDropdownData: any = [];
  sectionCodeDropdownData: any = [];
  costCenterDropdownData: any = [];
  selectedTransactionCodes: string[] = [];
  deletedTransactions: any[] = [];
  plantLocationId: number = 0;
  locations: any[] = APIConstant.locationsListDropdown;
  offset: number = 0;
  count: number = Number.MAX_VALUE;
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
      profitCenter: [''],
      businessPlace: [''],
      sectionCode: [''],
      costCenter: [''],
      locationId: ['', Validators.required],
      dsc: ['', Validators.required],
      dcp: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.baseService.plantSpinner.next(true);
    this.queryData = this._Activatedroute.snapshot.paramMap.get("plantId");
    this.getLocations();
    this.getProfitCenters();
    this.getBusinessPlaces();
    this.getCostCenters();
    this.getSectionCodes();
    this.getTransactionTypes();
    this.getEditPlantData();
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
  getProfitCenters() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'ProfitCenter';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.profitCenterDropdownData = res.lookUps;
      console.log(res.lookUps);
      
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    });
  }

  getBusinessPlaces() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'BusinessPlace';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.businessPlaceDropdownData = res.lookUps;
      console.log(res.lookUps);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    });
  }

  getSectionCodes() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'SectionCode';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.sectionCodeDropdownData = res.lookUps;
      console.log(res.lookUps);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    });
  }

  getCostCenters() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'CostCenter';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.costCenterDropdownData = res.lookUps;
      console.log(res.lookUps);
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    });
  }

  getPlantData(plantId: string) {
    const location = this.locationsDropdownData.find((loc: any) => loc.id === this.plantLocationId)
    
    this.plantService.getPlantData(this.plantLocationId,plantId).subscribe((response: any) => {
      this.plantForm.setValue({
        plantCode: response.plantCode,
        plantDesc: response.plantDesc,
        plantAddress: response.plantAddress,
        city: response.city,
        stateCode: response.state,
        gstnNo: response.gstInNo,
        panNo: response.panNo,
        plantType: response.plantType,
        siteCode: response.siteCode,
        profitCenter: response?.profitCenter,
        businessPlace: response?.businessPlace,
        sectionCode: response?.sectionCode,
        costCenter: response?.costCenter,
        locationId: response.locations.id,
        dsc: location?.attribute3,
        dcp: location?.attribute4,
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
    this.transactionService.getTransactionTypes(data, this.offset, this.count).subscribe((response: any) => {
      this.transactionTypesList = response.transactionTypes
    }, error => {

    })
  }

  onCancelPress() {
    this.router.navigate(['/master/plant'])
  }

  onPressSave() {
    const locationCode = this.plantForm.controls['locationId']?.value
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
      actionBy: localStorage.getItem("userId"),
      dsc: this.plantForm.controls['dsc'].value,
      dcp: this.plantForm.controls['dcp'].value,
      profitCenter: this.plantForm.controls['profitCenter'].value,
      businessPlace: this.plantForm.controls['businessPlace'].value,
      sectionCode: this.plantForm.controls['sectionCode'].value,
      costCenter: this.plantForm.controls['costCenter'].value,
      transactionTypeDetails: transactionData
    }

    console.log(data);
    
    this.plantService.updatePlant(locationCode,this.queryData, data).subscribe((response: any) => {
      this.plantData = response;
      this.toastr.success('Plant Update Successfully');
      this.baseService.plantSpinner.next(false);
      this.router.navigate(['master/plant']);
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
    this.plantData.transactionTypeMapping[index].name = e?.name;
    this.plantData.transactionTypeMapping[index].status = e?.status;
    this.plantData.transactionTypeMapping[index].code = e?.code;
    this.plantData.transactionTypeMapping[index].transactionTypeId = e?.id

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
    if (deletedTransaction.id != 0 && deletedTransaction.transactionTypeId) {
      this.deletedTransactions.push(deletedTransaction);
    }
    this.selectedTransactionCodes = this.selectedTransactionCodes.filter(
      code => code !== transaction.code
  );
  this.plantData.transactionTypeMapping.splice(index, 1);
  this.updateSelectedTransactionCodes();
  }

  getEditPlantData() { 
    let data = {
      "locationIds": APIConstant.locationsListDropdown.map((e: any) => (e.id)),
      "plantCode": "",
      "city": "",
      "state": "",
      "auCode": "",
      "siteCode": ""
    }
    this.plantService.getPlants(data).subscribe((response: any) => {
      this.plantsList = response.plants;
      this.getLocationId().then(() => {
        this.getPlantData(this.queryData);
      });
    });
  }
  
  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const plant = this.plantsList.filter((plant: any) => {
        return plant.id == this.queryData
      });
      if (plant.length > 0) {
        this.plantLocationId = plant[0].locations.id;
        resolve();
      } else {
        reject('No matching plant found');
      }
    });
  }

  onTransactionClear(ind: number) {
    this.plantData.transactionTypeMapping[ind].code = null;
  }

  nullTransactionCode(): boolean {
    return this.plantData.transactionTypeMapping.some(
      (mapping) => mapping.code === null
    );
  }

  getLocationData(data: any){
    const locationData = this.locations.find((item: any) => {
    return item.id == data;
    })
    this.plantForm.patchValue({
      dsc: locationData.attribute1,
      dcp: locationData.attribute2
    })
  }
}