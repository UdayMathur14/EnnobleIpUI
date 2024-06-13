import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';
import { DispatchNoteModelComponent } from '../../../../modals/dispatch-note/dispatch-note.component';

@Component({
  selector: 'app-dispatch-note-grid-table',
  templateUrl: './dispatch-note-grid-table.component.html',
  styleUrl: './dispatch-note-grid-table.component.scss'
})
export class DispatchNoteGridTableComponent {

  @Input() dispatchNotes: any = [];

  constructor(private router: Router,
    private modalService: NgbModal) { }

  onEditDispatchNote(dispatchNote:any) {
    this.router.navigate([`transaction/addEditDispatchNote/${dispatchNote.locationId}/${dispatchNote.id}`]);
  }

  onPreviewDispatchNote(dispatch: any){
    let dispatchNoteModal = this.modalService.open(DispatchNoteModelComponent, {
      size: "lg",
      backdrop: "static",
    });
    dispatchNoteModal.componentInstance.dispatch = dispatch;

    dispatchNoteModal.result.then(
      (result) => {
        if (result) {

        }
      },
      (reason) => {
      }
    );
  }

}