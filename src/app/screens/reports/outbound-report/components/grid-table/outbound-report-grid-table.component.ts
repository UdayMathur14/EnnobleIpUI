import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlTaxationOutBoundComponent } from '../../../../modals/gl-taxation-out-bound/gl-taxation-out-bound.component';
import { GlTdsOutBoundComponent } from '../../../../modals/gl-tds-out-bound/gl-tds-out-bound.component';

@Component({
  selector: 'app-outbound-report-grid-table',
  templateUrl: './outbound-report-grid-table.component.html',
  styleUrl: './outbound-report-grid-table.component.scss'
})
export class OutboundReportGridTableComponent {

  @Input() reportData: any = [];
  @ViewChild('table') table!: ElementRef;
  @Output() exportHeader = new EventEmitter<string[]>();

  constructor(private modalService: NgbModal){}

  onPreviewGLTaxationBound(reportData:any) {
    let GlTaxationOutBoundModal = this.modalService.open(GlTaxationOutBoundComponent,
      {
        size: 'xl',
        backdrop: 'static',
        windowClass: 'custom-modal',
        scrollable: true,
      }
    );
    GlTaxationOutBoundModal.componentInstance.reportData = reportData;

    GlTaxationOutBoundModal.result.then(
      (result) => {

      },
    );
  }

  onPreviewGLTdsOutBound(reportData:any) {
    let GlTaxationOutBoundModal = this.modalService.open(GlTdsOutBoundComponent,
      {
        size: 'xl',
        backdrop: 'static',
        windowClass: 'custom-modal',
        scrollable: true,
      }
    );
    GlTaxationOutBoundModal.componentInstance.reportData = reportData;

    GlTaxationOutBoundModal.result.then(
      (result) => {

      },
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportData']) {
      this.emitHeaders();
    }
  }

  emitHeaders() {
    const headers: string[] = [];
    const headerCells = this.table?.nativeElement?.querySelectorAll('thead th');
    
    headerCells?.forEach((cell: any) => {
      if (cell.innerText.trim() !== 'GL Taxation OutBound' && cell.innerText.trim() !== 'GL TDS OutBound') {
        headers.push(cell.innerText.trim());
      }
    });
    this.exportHeader.emit(headers);
  }

}
