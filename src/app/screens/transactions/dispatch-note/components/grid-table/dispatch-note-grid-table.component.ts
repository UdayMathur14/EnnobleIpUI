import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';

@Component({
  selector: 'app-dispatch-note-grid-table',
  templateUrl: './dispatch-note-grid-table.component.html',
  styleUrl: './dispatch-note-grid-table.component.scss'
})
export class DispatchNoteGridTableComponent {

  @Input() dispatchNotes: any = [];

  constructor(private router: Router,
    private modalService: NgbModal) { }

  onEditDispatchNote(id:Number) {
    this.router.navigate([`transaction/addEditDispatchNote/${id}`]);
  }

  onPreviewDeliveryNote() {
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