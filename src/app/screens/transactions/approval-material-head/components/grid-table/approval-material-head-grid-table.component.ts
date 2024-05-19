import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalMaterialHeadModalComponent } from '../../../../modals/approval-material-head/approval-material-head.component';
import { ToastrService } from 'ngx-toastr';
import { BiltiBillProcessService } from '../../../../../core/service/biltiBillProcess.service';
import { BiltiProcessDetailsModalComponent } from '../../../../modals/bilti-bill-process-details/bilti-process-details.component';

@Component({
  selector: 'app-approval-material-head-grid-table',
  templateUrl: './approval-material-head-grid-table.component.html',
  styleUrl: './approval-material-head-grid-table.component.scss'
})
export class ApprovalMaterialHeadGridTableComponent implements OnInit {

  biltiBillProcessList: any = [];
  loadSpinner: boolean = true;
  @Input() biltiBillProcess: any = [];

  constructor(private router: Router,
    private modalService: NgbModal) {}

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
          if (result) {
  
          }
        },
        (reason) => {}
      );
    }
   
    
}
