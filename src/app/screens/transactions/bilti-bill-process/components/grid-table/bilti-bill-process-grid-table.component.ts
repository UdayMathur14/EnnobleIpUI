import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';
import { BiltiProcessDetailsModalComponent } from '../../../../modals/bilti-bill-process-details/bilti-process-details.component';
import { DebitNoteDetailsModalComponent } from '../../../../modals/debit-note-details/debit-note-details.component';


@Component({
  selector: 'app-bilti-bill-process-grid-table',
  templateUrl: './bilti-bill-process-grid-table.component.html',
  styleUrl: './bilti-bill-process-grid-table.component.scss'
})
export class BiltiBillProcessGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) { }

  onOpenProcessModal() {
    let processDetailsModal = this.modalService.open(BiltiProcessDetailsModalComponent, {
      size: "xl",
      backdrop: "static",
    });

    processDetailsModal.result.then(
      (result) => {
        if (result) {

        }
      },
      (reason) => {
      }
    );
  }

  onOpenDebitNoteModal(){
    let debitNoteModal = this.modalService.open(DebitNoteDetailsModalComponent, {
      size: "xl",
      backdrop: "static",
    });

    debitNoteModal.result.then(
      (result) => {
        if (result) {

        }
      },
      (reason) => {
      }
    );
  }

  onEditBilti() {
    this.router.navigate(['transaction/addEditBilti']);
  }
}
