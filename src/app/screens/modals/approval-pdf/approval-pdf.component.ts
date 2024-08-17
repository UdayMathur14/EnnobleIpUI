import { Component, Input, OnInit } from '@angular/core';
import { PdfService } from '../../../core/service/pdf.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APIConstant } from '../../../core/constants';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';

@Component({
  selector: 'app-approval-pdf',
  templateUrl: './approval-pdf.component.html',
  styleUrl: './approval-pdf.component.scss',
})
export class ApprovalPdfComponent implements OnInit {
  approvalData: any = [];
  @Input() biltiData: any = [];
  @Input() title: any = [];
  adviceType: any;
  batchName: any;
  constructor(
    private pdfService: PdfService,
    private activeModal: NgbActiveModal,
    private biltiService: BiltiBillProcessService
  ) {}

  ngOnInit(): void {
    this.getApprovalBiltiData();
    this.getBiltiInfo();
    console.log(this.biltiData);
    
  }

  downloadPDF() {
    const data = document.getElementById('approval-content') as HTMLElement;
    this.pdfService.generatePdf(data, 'approval');
    this.onClose();
  }

  getApprovalBiltiData() {
    let data = {
      locationIds: APIConstant.locationsListDropdown.map((e: any) => e.id),
      status: '',
      screenCode: 0,
      fromDate: null,
      toDate: null,
      batchNumber: this.title == 'report' ? this.biltiData?.batchNumber : this.biltiData[0]?.biltiBillProcessModel?.batchNumber,
      adviceType: '',
      batchName: '',
      biltiNumber: '',
    };
    this.biltiService.getBiltiApprovalData(data).subscribe((response: any) => {
      this.approvalData = response
      console.log(response);
      
      });
  }

  getBiltiInfo(){
    const biltiBillProcessModel =
      this.biltiData[0]?.biltiBillProcessModel.batchNumber;

    if (biltiBillProcessModel) {
     this.adviceType = biltiBillProcessModel.split('_')[0];
     this.batchName = biltiBillProcessModel.split('_').slice(0, 2).join('_');
    }
  }

  onClose() {
    this.activeModal.close();
  }
}
