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
  locations: any[] = APIConstant.commonLocationsList;
  commonLocations: any[] = [];
  offset: number = 0;
  count: number = Number.MAX_VALUE;
  loadSpinner: boolean = false;
  freightCity: any = [];
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
      auCode: [''],
      status: ['Active', Validators.required],
      freightCity: ['']
    });
  }

  ngOnInit(): void {
    this.getCommonLocations();
    this.loadSpinner = true;
    this.baseService.plantSpinner.next(true);
    this.queryData = this._Activatedroute.snapshot.paramMap.get("plantId");
    this.getLocations();
    this.getProfitCenters();
    this.getBusinessPlaces();
    this.getCostCenters();
    this.getSectionCodes();
    this.getTransactionTypes();
    this.getFreightCity();
    setTimeout(() => {
      this.getPlantData();
    }, 1000);
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locationsDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active' && 
        this.commonLocations.some((location: any) => location.id === item.id));

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
      this.profitCenterDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active');
      
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
      this.businessPlaceDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active');;
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
      this.sectionCodeDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active');
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
      this.costCenterDropdownData = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
    });
  }

  getPlantData() {
    this.loadSpinner = true;
    const location = this.locationsDropdownData.find((loc: any) => loc.id === this.plantLocationId)
    
    this.plantService.getPlantData(this.queryData).subscribe((response: any) => {
      this.plantForm.patchValue({
        plantCode: response?.plantCode,
        plantDesc: response?.plantDesc,
        plantAddress: response?.plantAddress,
        city: response?.city,
        stateCode: response?.state,
        gstnNo: response?.gstInNo,
        panNo: response?.panNo,
        plantType: response?.plantType,
        siteCode: response?.siteCode,
        profitCenter: response?.profitCenter,
        businessPlace: response?.businessPlace,
        sectionCode: response?.sectionCode,
        costCenter: response?.costCenter,
        status: response?.status,
        auCode: response?.auCode,
        freightCity: response?.freightCity
      });
      this.plantData = response;
      this.initializeSelectedTransactionCodes();
      this.baseService.plantSpinner.next(false);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
      this.loadSpinner = false;
    })
  }

  getTransactionTypes() {
    let data = {
      "code": ''
    }
    this.transactionService.getTransactionTypes(data, this.offset, this.count).subscribe((response: any) => {
      this.transactionTypesList = response.transactionTypes
      this.transactionTypesList = response.transactionTypes.filter(
        (transactionType: any) => transactionType.status === 'Active'
      );
    }, error => {

    })
  }

  onCancelPress() {
    this.router.navigate(['/master/plant'])
  }

  onPressSave() {
    this.loadSpinner = true;
    this.baseService.plantSpinner.next(true);
    let transactionData: { id: number; transactionTypeId: number; status: string; }[] = [];
    this.plantData.transactionTypeMapping.forEach((e) => {
      
      let transactionObj = {
        id: e.locations.id,
        transactionTypeId: e.transactionTypeId,
        status: e.status,
        locationId: e.locations.id || e.locations.value,
        dsc: e.dsc,
        dcp: e.dcp
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
      profitCenter: this.plantForm.controls['profitCenter'].value,
      businessPlace: this.plantForm.controls['businessPlace'].value,
      sectionCode: this.plantForm.controls['sectionCode'].value,
      costCenter: this.plantForm.controls['costCenter'].value,
      transactionTypeDetails: transactionData,
      freightCity: this.plantForm.controls['freightCity'].value
    }
    
    this.plantService.updatePlant(this.queryData, data).subscribe((response: any) => {
      this.plantData = response;
      this.toastr.success('Plant Updated Successfully');
      this.baseService.plantSpinner.next(false);
      this.router.navigate(['master/plant']);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.baseService.plantSpinner.next(false);
      this.loadSpinner = false;
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
      transactionTypeId: 0,
      locations: {id: 0, value: ''},
      dcp: '',
      dsc: ''
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
    return this.transactionTypesList.filter((transaction: any) => {
      const duplicateTransaction = this.plantData.transactionTypeMapping.some(
        (t, i) =>
          i !== index &&
          t.locations.id === this.plantData.transactionTypeMapping[index].locations.id &&
          t.code === transaction.code
      );
      return !duplicateTransaction || this.plantData.transactionTypeMapping[index].code === transaction.code;
    });
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
      locationId: transaction.locationId,
      transactionTypeId: transaction.transactionTypeId,
      status: 'Inactive',
      dsc: transaction?.dsc,
      dcp: transaction?.dcp
    };
    if (deletedTransaction.locationId != 0 && deletedTransaction.transactionTypeId) {
      this.deletedTransactions.push(deletedTransaction);
    }
    this.selectedTransactionCodes = this.selectedTransactionCodes.filter(
      code => code !== transaction.code
  );
  this.plantData.transactionTypeMapping.splice(index, 1);
  this.updateSelectedTransactionCodes();
  }
  
  getLocationId(): Promise<void> {
    return new Promise((resolve, reject) => {
      const plant = this.plantsList.filter((plant: any) => {
        return plant.id == this.queryData
      });
      if (plant.length > 0) {
        this.plantLocationId = plant[0]?.locations?.id;
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

  getLocationData(e: any, index: any){
    const locationData = this.locations.find((item: any) => {
    return item.id == e;
    })
    this.plantData.transactionTypeMapping[index].locations.id = locationData?.id;
    this.plantData.transactionTypeMapping[index].dsc = locationData?.attribute3;
    this.plantData.transactionTypeMapping[index].dcp = locationData?.attribute4;
  }

  getFreightCity() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'FreightCity';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.freightCity = res.lookUps.filter(
        (item: any) => item.status === 'Active');
    }, error => {

    });
  }
}