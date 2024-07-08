import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionTypeModalComponent } from '../../../../modals/transaction-type/transaction-type.component';
import { DeliveryNoteModalComponent } from '../../../../modals/delivery-note/delivery-note.component';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { BiltiPdfModalComponent } from '../../../../modals/bilti-pdf/bilti-pdf.component';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-bilti-grid-table',
  templateUrl: './bilti-grid-table.component.html',
  styleUrl: './bilti-grid-table.component.scss',
})
export class BiltiGridTableComponent implements OnInit {
  @Input() biltisList: any = [];
  loadSpinner: boolean = false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private biltiService: BiltiService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

  }

  onPreviewBilti() {
    let documentModal = this.modalService.open(DeliveryNoteModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    documentModal.componentInstance.title = 'Bilti';

    documentModal.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {}
    );
  }

  onPreviewPdf(bilti: any) {
    let documentModal = this.modalService.open(BiltiPdfModalComponent, {
      size: 'lg',
      backdrop: 'static',
      windowClass: 'modal-width',
    });
    documentModal.componentInstance.title = 'Bilti';
    documentModal.componentInstance.biltiData = bilti;

    documentModal.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => {}
    );
  }

  onEditBilti(bilti: any) {
    this.router.navigate([
      `transaction/addEditBilti/${bilti.locationId}/${bilti.id}`,
    ]);
  }
}
