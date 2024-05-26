import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChangeBiltiStatusModalComponent } from '../../../../modals/change-bilti-status/change-bilti-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeBiltiStatusService } from '../../../../../core/service/change-bilti-status.service';

@Component({
  selector: 'app-change-bilti-status-grid-table',
  templateUrl: './change-bilti-status-grid-table.component.html',
  styleUrl: './change-bilti-status-grid-table.component.scss'
})
export class ChangeBiltiStatusGridTableComponent implements OnInit {
  biltiBillProcessList: any = [];
  loadSpinner: boolean = true;
  @Input() biltiBillProcess: any = [];

  constructor(private modalService: NgbModal,
    private changeBiltiStatusService: ChangeBiltiStatusService
  ){

  }
  
  ngOnInit(): void {
    
  }
  
  changeBiltiStatus(bilti: any){
    let biltiModal = this.modalService.open(ChangeBiltiStatusModalComponent, {
      size: "md",
      backdrop: "static",
    });
    biltiModal.componentInstance.biltiData = bilti;
    biltiModal.result.then(
      (result) => {
       
      },
      (reason) => {
      }
    );

  }

  openPDF(biltiNumber: number) {
    this.changeBiltiStatusService.getNocPdf(biltiNumber).subscribe((response: any) => {
      const pdfBase64 = response.nocFileData;
      const blob = this.base64ToBlob(pdfBase64, 'application/pdf');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }
}
