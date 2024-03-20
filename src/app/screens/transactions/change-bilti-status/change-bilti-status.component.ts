import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeBiltiStatusModalComponent } from '../../modals/change-bilti-status/change-bilti-status.component';

@Component({
  selector: 'app-change-bilti-status',
  templateUrl: './change-bilti-status.component.html',
  styleUrl: './change-bilti-status.component.scss'
})
export class ChangeBiltiStatusComponent {
  constructor(private router: Router,
    private modalService: NgbModal) { }
  isFilters: boolean = true; 

  onChangeBilti(){
    let debitNoteModal = this.modalService.open(ChangeBiltiStatusModalComponent, {
      size: "md",
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
}
