import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../../../core/service';
import { ToastrService } from 'ngx-toastr';
import { PlantDataModel } from '../../../../core/model/plant.model';
import { BaseService } from '../../../../core/service/base.service';
import { TransactionTypesService } from '../../../../core/service/transactionTypes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private plantService: PlantService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private baseService: BaseService,
    private transactionService: TransactionTypesService
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
  }

  getPlantData(plantId: string) {
    this.plantService.getPlantData(plantId).subscribe((response: any) => {
      this.plantForm.setValue({
        plantCode: response.plantCode,
        plantDesc: response.plantDesc,
        plantAddress: response.plantAddress,
        city: response.city,
        stateCode: response.stateCode,
        gstnNo: response.gstnNo,
        panNo: response.panNo,
        plantType: response.plantType,
        siteCode: response.siteCode,
        locationId: response.locationId,
        dsc: response.dsc,
        dcp: response.dcp,
        status: response.status,
      });
      this.plantData = response;
      this.baseService.plantSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
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
    let data = {
      locationId: this.plantData.locationId,
      dsc: this.plantData.dsc,
      dcp: this.plantData.dcp,
      transactionType: '',
      modifiedBy: '',
      status: this.plantData.status,
      transactionTypeDetails : this.plantData.transactionTypeMapping
    }
    this.plantService.updatePlant(this.queryData, data).subscribe((response: any) => {
      this.plantData = response;
      this.toastr.success('Plant Update Successfully');
      this.baseService.plantSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
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
      code: ''
    }
    this.plantData.transactionTypeMapping.push(obj);
  }

  onTransactionSelect(e: any, index: any) {
    this.plantData.transactionTypeMapping[index].name = e.name;
    this.plantData.transactionTypeMapping[index].status = e.status;
    this.plantData.transactionTypeMapping[index].code = e.code;
  }

}