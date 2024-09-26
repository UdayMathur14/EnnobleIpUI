import { Component, Input, OnInit } from '@angular/core';
import { PdfService } from '../../../core/service/pdf.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APIConstant } from '../../../core/constants';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  loadSpinner: boolean = false;
  constructor(
    private pdfService: PdfService,
    private activeModal: NgbActiveModal,
    private biltiService: BiltiBillProcessService
  ) {}

  ngOnInit(): void {
    this.getApprovalBiltiData();
    this.getBiltiInfo();
    
  }

  downloadPDF() {
    this.loadSpinner =true;
    const data = document.getElementById('approval-content');

    if (!data) {
      console.error('Element not found: approval-content');
      return;
    }

    const options = {
      scale: 2,
      useCORS: true,
    };
  
    html2canvas(data, options).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
  
      let position = 0;
  
      while (heightLeft >= 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft >= 0) {
          pdf.addPage();
        }
      }
  
      pdf.save('approval.pdf');
      this.onClose();
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  }
  

  getApprovalBiltiData() {
    let data = {
      locationIds: APIConstant.commonLocationsList.map((e: any) => e.id),
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
    this.loadSpinner = false;
  }
}
