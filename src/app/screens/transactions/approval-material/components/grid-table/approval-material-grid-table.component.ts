import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';

@Component({
  selector: 'app-approval-material-grid-table',
  templateUrl: './approval-material-grid-table.component.html',
  styleUrl: './approval-material-grid-table.component.scss'
})
export class ApprovalMaterialGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

    onPreviewBiltiDetails(){
      let deliveryNoteModal = this.modalService.open(DeliveryNoteModalComponent, {
        size: "lg",
        backdrop: "static",
      });
      // deliveryNoteModal.componentInstance.data = data;
  
      deliveryNoteModal.result.then(
        (result) => {
          if (result) {
  
          }
        },
        (reason) => {
        }
      );
    }

}