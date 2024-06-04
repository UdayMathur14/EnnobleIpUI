import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { PlantService } from '../../../../../core/service';
import { BaseService } from '../../../../../core/service/base.service';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService
  ) { }
  @ViewChild('table') table!: ElementRef;
  @Input() filterKeyword!: string;
  @Output() dataChange = new EventEmitter<any[]>();
  @Output() headersChange = new EventEmitter<string[]>();
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
    this.dataChange.emit(this.plantsList);
  }

  getAllPlantsList() {
    let data = {
      "plantCode": ''
    }
    this.plantService.getPlants(data).subscribe((response: any) => {
      this.plantsList = response.plants;
      this.plantsListOrg = response.plants;
      this.loadSpinner = false;
      this.dataChange.emit(this.plantsList);
      this.emitHeaders();  // Emit headers after the data is fetched and set
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table.nativeElement.querySelectorAll('thead th');
    headerCells.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Actions') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    this.headersChange.emit(headers);
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
    this.dataChange.emit(this.plantsList);
  }
}