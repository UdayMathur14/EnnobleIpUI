import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { PlantService } from '../../../../../core/service';
import { BaseService } from '../../../../../core/service/base.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-plant-grid-table',
  templateUrl: './plant-grid-table.component.html',
  styleUrl: './plant-grid-table.component.scss'
})
export class PlantGridTableComponent implements OnInit, OnChanges {
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private plantService : PlantService,
    private baseService : BaseService,
    private toastr: ToastrService,
    private lookupService : LookupService
  ) { }

  @Input()
  filterKeyword!: string;
  plantsListOrg : any;
  plantsList : any;

  ngOnInit() :void{
    this.getAllPlantsList();
    let loc = this.lookupService.locations.subscribe((response:any) => {
      localStorage.setItem('locationId', response[0].id)
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.plantsListOrg && this.plantsListOrg.length && changes['filterKeyword'].currentValue){
      this.plantsList = this.plantsListOrg.filter((e:any) =>e.plantCode.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if(this.plantsListOrg && this.plantsListOrg.length && !changes['filterKeyword'].currentValue){
      this.plantsList = this.plantsListOrg;
    }
  }

  getAllPlantsList(){
    let data = {
      "plantCode" : ''
    }
    this.plantService.getPlants(data).subscribe((response:any) => {
      this.plantsList = response.plants;
      this.plantsListOrg = response.plants;
      this.baseService.plantSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.plantSpinner.next(false);
    })
  }

  onGoToEditPlant(plantData:any) {
    this.router.navigate(['master/addEditPlant',  plantData.id]);
  }

  onLinkClick(plant:any) {
    let transactionTypeModal = this.modalService.open(TransactionTypeModalComponent, {
      size: "lg",
      backdrop: "static",
    });
    transactionTypeModal.componentInstance.transactionTypes = plant.transactionTypeMapping;

    transactionTypeModal.result.then(
      (result) => {
          if (result) {

          }
      },
      (reason) => {
      }
  );

  }
}