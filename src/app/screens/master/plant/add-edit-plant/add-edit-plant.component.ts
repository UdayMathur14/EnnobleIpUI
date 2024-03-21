import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../../../core/service';
import { ToastrService } from 'ngx-toastr';
import { PlantDataModel } from '../../../../core/model/plant.model';
import { BaseService } from '../../../../core/service/base.service';

@Component({
  selector: 'app-add-edit-plant',
  templateUrl: './add-edit-plant.component.html',
  styleUrl: './add-edit-plant.component.scss'
})

export class AddEditPlantComponent implements OnInit {
  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private plantService: PlantService,
    private toastr: ToastrService,
    private baseService : BaseService
  ) { }
  queryData: any;
  plantData!: PlantDataModel;
  plantsList: any = [];

  ngOnInit(): void {
    this.baseService.plantSpinner.next(true);
    this.queryData = this._Activatedroute.snapshot.paramMap.get("plantId");   
    this.getPlantData(this.queryData);
    this.getAllPlantsList();
  }

  getPlantData(plantId: string) {
    this.plantService.getPlantData(plantId).subscribe((response: any) => {
      this.plantData = response;
      this.baseService.plantSpinner.next(false);
    }, err => {
    })
  }

  getAllPlantsList() {
    let data = {
      "plantCode": ''
    }
    this.plantService.getPlants(data).subscribe((response: any) => {
      this.plantsList = response.plants;
      this.baseService.plantSpinner.next(false);
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/plant'])
  }

  onPressSave(){
    this.baseService.plantSpinner.next(true);
    let data = {
      locationId: this.plantData.locationId,
      dsc: this.plantData.dsc,
      dcp: this.plantData.dcp,
      transactionType: '',
      modifiedBy: '',
      status: this.plantData.status
    }
    this.plantService.updatePlant(this.queryData, data).subscribe((response: any) => {
      this.plantData = response;
      this.baseService.plantSpinner.next(false);
    })
  }

}


