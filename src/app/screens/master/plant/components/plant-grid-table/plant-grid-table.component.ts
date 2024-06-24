import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { CommonUtility } from '../../../../../core/utilities/common';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-plant-grid-table',
  templateUrl: './plant-grid-table.component.html',
  styleUrl: './plant-grid-table.component.scss'
})
export class PlantGridTableComponent implements OnInit, OnChanges {
  @Input() plantsList : any[] = [];
  @ViewChild('table') table!: ElementRef;
  // @Input() locationSel!: string;
  @Output() headersChange = new EventEmitter<string[]>();
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plantsList']) {
      this.emitHeaders();
    }
  }

  // ngOnChanges(changes: SimpleChanges | any): void {
  //   if (this.plantsListOrg && this.plantsListOrg.length && changes?.['filterKeyword']?.currentValue) {
  //     this.plantsList = this.plantsListOrg.filter((e: any) => e.plantCode.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
  //   }
  //   else if (this.plantsListOrg && this.plantsListOrg.length && !changes?.['filterKeyword']?.currentValue) {
  //     this.plantsList = this.plantsListOrg;
  //   }

  //   if (changes?.locationIds.currentValue) {
  //     this.getAllPlantsList();
  //   }
  //   this.dataChange.emit(this.plantsList);
  // }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Actions') { // Exclude "Actions" header
        headers.push(cell.innerText.trim());
      }
    });
    //this.exportHeader.emit(headers);
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