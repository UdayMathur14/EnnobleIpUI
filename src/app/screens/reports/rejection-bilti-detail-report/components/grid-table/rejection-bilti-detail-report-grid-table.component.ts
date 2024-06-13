import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';
import { BiltiProcessDetailsModalComponent } from '../../../../modals/bilti-bill-process-details/bilti-process-details.component';


@Component({
  selector: 'app-rejection-bilti-detail-report-grid-table',
  templateUrl: './rejection-bilti-detail-report-grid-table.component.html',
  styleUrl: './rejection-bilti-detail-report-grid-table.component.scss'
})
export class RejectionBiltiDetailReportGridTableComponent {

  biltiBillProcessList: any = [];
  loadSpinner: boolean = true;
  @Input() biltiBillProcess: any = [];
  @Output() refreshList = new EventEmitter<void>();
  constructor(private router: Router,
    private modalService: NgbModal) { }
    
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
  onEditBilti() {
    this.router.navigate(['transaction/addEditBilti']);
  }
}
