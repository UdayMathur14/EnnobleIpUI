import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbTimepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeComponent } from '../../../../modals/transaction-type/transaction-type.component';

@Component({
  selector: 'app-plant-grid-table',
  templateUrl: './plant-grid-table.component.html',
  styleUrl: './plant-grid-table.component.scss'
})
export class PlantGridTableComponent {
  constructor(
    private router: Router,
    private modalService: NgbModal
  ) { }

  onGoToEditPlant() {
    this.router.navigate(['master/addEditPlant']);
  }

  onLinkClick() {
    let transactionTypeModal = this.modalService.open(TransactionTypeComponent, {
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