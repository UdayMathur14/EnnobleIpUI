import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalMaterialHeadModalComponent } from '../../../../modals/approval-material-head/approval-material-head.component';

@Component({
  selector: 'app-approval-material-head-grid-table',
  templateUrl: './approval-material-head-grid-table.component.html',
  styleUrl: './approval-material-head-grid-table.component.scss'
})
export class ApprovalMaterialHeadGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

    onPreviewApprovalMatHead(){
      let deliveryNoteModal = this.modalService.open(ApprovalMaterialHeadModalComponent, {
        size: "xl",
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
