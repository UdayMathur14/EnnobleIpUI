import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountMaterialBiltiProcessDetailsModalComponent } from '../../../../modals/accMat-bilti-bill-process-details/accMat-bilti-process-details.component';

@Component({
  selector: 'app-approval-accounts-grid-table',
  templateUrl: './approval-accounts-grid-table.component.html',
  styleUrl: './approval-accounts-grid-table.component.scss',
})
export class ApprovalAccountsGridTableComponent implements OnInit {

  @Input() biltiBillProcess: any = [];
  constructor(
    private router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {

  }

  onPreviewBiltiDetails() {
    let deliveryNoteModal = this.modalService.open(
      AccountMaterialBiltiProcessDetailsModalComponent,
      {
        size: 'xl',
        backdrop: 'static',
      }
    );
    // deliveryNoteModal.componentInstance.data = data;

    deliveryNoteModal.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {}
    );
  }
}
