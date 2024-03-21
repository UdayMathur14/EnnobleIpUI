import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../../../core/service';
import { ToastrService } from 'ngx-toastr';
import { PlantDataModel } from '../../../../core/model/plant.model';

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
    private toastr: ToastrService
  ) { }
  queryData: any;
  plantData!: PlantDataModel;
  plantsList: any = [];

  ngOnInit(): void {
    this.queryData = this._Activatedroute.snapshot.paramMap.get("plantId");
    this.getPlantData(this.queryData);
    this.getAllPlantsList();
  }

  getPlantData(plantId: string) {
    this.plantService.getPlantData(plantId).subscribe((response: any) => {
      this.plantData = response;
    }, err => {
    })
  }

  getAllPlantsList() {
    let data = {
      "plantCode": ''
    }
    this.plantService.getPlants(data).subscribe((response: any) => {
      this.plantsList = response.plants;
    })
  }

  onCancelPress() {
    this.router.navigate(['/master/plant'])
  }

}


