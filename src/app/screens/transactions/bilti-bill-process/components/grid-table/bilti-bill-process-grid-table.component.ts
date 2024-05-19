import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BiltiProcessDetailsModalComponent } from '../../../../modals/bilti-bill-process-details/bilti-process-details.component';
import { DebitNoteDetailsModalComponent } from '../../../../modals/debit-note-details/debit-note-details.component';
import { BiltiBillProcessService } from '../../../../../core/service/biltiBillProcess.service';
import * as moment from 'moment';


@Component({
  selector: 'app-bilti-bill-process-grid-table',
  templateUrl: './bilti-bill-process-grid-table.component.html',
  styleUrl: './bilti-bill-process-grid-table.component.scss'
})
export class BiltiBillProcessGridTableComponent implements OnInit{
  // biltiBillProcess: any = [];
  @Input() biltiBillProcess: any = [];
  @Output() refreshList = new EventEmitter<void>();
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private biltiBIllProService: BiltiBillProcessService,
  ) { }

  ngOnInit(): void {
  }

  onOpenProcessModal(biltiProcess:any) {
    let processDetailsModal = this.modalService.open(BiltiProcessDetailsModalComponent, {
      size: "xl",
      backdrop: "static",
    });
    processDetailsModal.componentInstance.biltiProcess = biltiProcess;
    processDetailsModal.result.then(
      (result) => {
        if (result) {
          if (result === 'save') {
            this.router.navigate(['transaction/biltiBillProcess']);
            this.refreshList.emit();
          }
        }
      },
    );
  }

  onOpenDebitNoteModal(biltiProcess:any){
    let debitNoteModal = this.modalService.open(DebitNoteDetailsModalComponent, {
      size: "xl",
      backdrop: "static",
    });
    debitNoteModal.componentInstance.biltiProcess = biltiProcess;
    debitNoteModal.result.then(
      (result) => {
        if (result) {

        }
      },
      (reason) => {
      }
    );
  }

  onEditBilti() {
    this.router.navigate(['transaction/addEditBilti']);
  }
}
