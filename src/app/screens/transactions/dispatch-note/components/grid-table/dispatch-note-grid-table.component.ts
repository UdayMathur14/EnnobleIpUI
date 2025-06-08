import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
  constructor(private router: Router,
    private modalService: NgbModal) { }

  onEditDispatchNote(dispatchNotes:any) {
    this.router.navigate(['transaction/addEditVendorInvoice',dispatchNotes.id]);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dispatchNotes']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Actions') { 
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }


}