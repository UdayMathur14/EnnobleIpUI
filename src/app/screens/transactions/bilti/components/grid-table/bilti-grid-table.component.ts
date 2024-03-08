import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';


@Component({
  selector: 'app-bilti-grid-table',
  templateUrl: './bilti-grid-table.component.html',
  styleUrl: './bilti-grid-table.component.scss'
})
export class BiltiGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) { }
  onPreviewBilti() {
    let documentModal = this.modalService.open(DeliveryNoteModalComponent, {
      size: "lg",
      backdrop: "static",
    });
    documentModal.componentInstance.title = 'Bilti';

    documentModal.result.then(
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
