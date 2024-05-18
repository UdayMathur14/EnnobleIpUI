import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalMaterialHeadModalComponent } from '../../../../modals/approval-material-head/approval-material-head.component';
import { ToastrService } from 'ngx-toastr';
import { BiltiBillProcessService } from '../../../../../core/service/biltiBillProcess.service';

@Component({
  selector: 'app-approval-material-head-grid-table',
  templateUrl: './approval-material-head-grid-table.component.html',
  styleUrl: './approval-material-head-grid-table.component.scss'
})
export class ApprovalMaterialHeadGridTableComponent implements OnInit {

  biltiBillProcessList: any = [];
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private modalService: NgbModal,
    private biltiBillService: BiltiBillProcessService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.getAllBiltiProcessList();
    }

    onPreviewApprovalMatHead(){
      let deliveryNoteModal = this.modalService.open(ApprovalMaterialHeadModalComponent, {
        size: "xl",
        backdrop: "static",
      });
      // deliveryNoteModal.componentInstance.data = data;
  
      deliveryNoteModal.result.then(
        (result) => {
          if (result) {
  
          }
        },
        (reason) => {
        }
      );
    }

    getAllBiltiProcessList() {
      this.loadSpinner = true;
      const data = {
        screenCode: 304,
        fromDate: '2024-04-18T12:19:20.868Z',
        toDate: '2024-05-18T12:19:20.868Z',
        batchNumber: '',
        adviceType: '',
        batchName: '',
        biltiNumber: '',
      };
      this.biltiBillService.getBiltiBillProcess(data).subscribe(
        (response: any) => {
          this.biltiBillProcessList = response.biltiBillProcess;
          this.loadSpinner = false;
        },
        (error) => {
          this.toastr.error(error.statusText, error.status);
          this.loadSpinner = false;
        }
      );
    }
}
