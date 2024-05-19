import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { PlantService } from '../../../../../core/service';
import { BaseService } from '../../../../../core/service/base.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../../../core/service/lookup.service';
import { CommonUtility } from '../../../../../core/utilities/common';

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
    private lookupService: LookupService,
    private toastr: ToastrService
  ) { }

  @Input()
  filterKeyword!: string;
  plantsListOrg : any;
  plantsList : any;
  loadSpinner : boolean = true;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  ngOnInit() :void{
    this.baseService.plantSpinner.next(true);
    setTimeout(() => {
      this.getAllPlantsList();
    }, 2000);
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.plantsListOrg && this.plantsListOrg.length && changes['filterKeyword'].currentValue) {
      this.plantsList = this.plantsListOrg.filter((e: any) => e.plantCode.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if (this.plantsListOrg && this.plantsListOrg.length && !changes['filterKeyword'].currentValue) {
      this.plantsList = this.plantsListOrg;
    }
  }

  getAllPlantsList() {
    let data = {
      "plantCode": ''
    }
    this.plantService.getPlants(data).subscribe((response: any) => {
      this.plantsList = response.plants;
      this.plantsListOrg = response.plants;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  onGoToEditPlant(plantData: any) {
    this.router.navigate(['master/addEditPlant', plantData.id]);
  }

  onLinkClick(plant: any) {
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

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.plantsList);
  }
}