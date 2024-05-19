import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckedMaterialTeamModalComponent } from '../../../../modals/checked-material-team/checked-material-team.component';
import { BiltiBillProcessService } from '../../../../../core/service/biltiBillProcess.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checked-materials-team-grid-table',
  templateUrl: './checked-materials-team-grid-table.component.html',
  styleUrl: './checked-materials-team-grid-table.component.scss'
})
export class CheckedMaterialsTeamGridTableComponent implements OnInit{

  biltiBillProcessList: any = [];
  loadSpinner: boolean = true;
  
  constructor(private router: Router,
    private modalService: NgbModal,
    private biltiBillService: BiltiBillProcessService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      this.getAllBiltiProcessList();
    }

    onPreviewCheckedMatTeam(){
      let deliveryNoteModal = this.modalService.open(CheckedMaterialTeamModalComponent, {
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
        screenCode: 303,
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
