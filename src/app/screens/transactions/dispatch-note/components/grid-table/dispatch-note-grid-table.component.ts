import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';

@Component({
  selector: 'app-dispatch-note-grid-table',
  templateUrl: './dispatch-note-grid-table.component.html',
  styleUrl: './dispatch-note-grid-table.component.scss'
})
export class DispatchNoteGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

  onEditDispatchNote(){
    this.router.navigate(['transaction/addEditDispatchNote']);
  }

  onPreviewDeliveryNote(){
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