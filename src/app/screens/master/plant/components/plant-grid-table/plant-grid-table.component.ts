import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { PlantService } from '../../../../../core/service';

@Component({
  selector: 'app-plant-grid-table',
  templateUrl: './plant-grid-table.component.html',
  styleUrl: './plant-grid-table.component.scss'
})
export class PlantGridTableComponent implements OnInit, OnChanges {
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private plantService : PlantService
  ) { }

  @Input()
  filterKeyword!: string;
  plantsListOrg : any;
  plantsList : any;

  ngOnInit() :void{
    this.getAllPlantsList();
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
    })
  }

  onGoToEditPlant(plantData:any) {
    this.router.navigate(['master/addEditPlant',  plantData.id]);
  }

  onLinkClick() {
    let transactionTypeModal = this.modalService.open(TransactionTypeModalComponent, {
      size: "lg",
      backdrop: "static",
    });
    // transactionTypeModal.componentInstance.data = data;

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