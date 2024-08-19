import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
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
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['biltiBillProcess']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'Bilti Details') {
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }
}
