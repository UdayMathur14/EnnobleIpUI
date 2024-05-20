import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountMaterialBiltiProcessDetailsModalComponent } from '../../../../modals/accMat-bilti-bill-process-details/accMat-bilti-process-details.component';
import { BiltiProcessDetailsModalComponent } from '../../../../modals/bilti-bill-process-details/bilti-process-details.component';

@Component({
  selector: 'app-approval-accounts-grid-table',
  templateUrl: './approval-accounts-grid-table.component.html',
  styleUrl: './approval-accounts-grid-table.component.scss',
})
export class ApprovalAccountsGridTableComponent implements OnInit {

  @Input() biltiBillProcess: any = [];
  @Output() refreshList = new EventEmitter<void>();
  constructor(
    private router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {

  }

  onPreviewBiltiDetails(biltiProcess:any) {
    let deliveryNoteModal = this.modalService.open(
      BiltiProcessDetailsModalComponent,
      {
        size: 'xl',
        backdrop: 'static',
      }
    );
    // deliveryNoteModal.componentInstance.data = data;
    deliveryNoteModal.componentInstance.biltiProcess = biltiProcess;

    deliveryNoteModal.result.then(
      (result) => {
        if (result === 'save') {
          this.router.navigate(['transaction/biltiBillProcess']);
          this.refreshList.emit();
        }
      },
      
    );
  }
}
