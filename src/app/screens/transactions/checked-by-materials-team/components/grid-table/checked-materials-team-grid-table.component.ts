import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckedMaterialTeamModalComponent } from '../../../../modals/checked-material-team/checked-material-team.component';
import { BiltiBillProcessService } from '../../../../../core/service/biltiBillProcess.service';
import { ToastrService } from 'ngx-toastr';
import { BiltiProcessDetailsModalComponent } from '../../../../modals/bilti-bill-process-details/bilti-process-details.component';

@Component({
  selector: 'app-checked-materials-team-grid-table',
  templateUrl: './checked-materials-team-grid-table.component.html',
  styleUrl: './checked-materials-team-grid-table.component.scss'
})
export class CheckedMaterialsTeamGridTableComponent implements OnInit{

  biltiBillProcessList: any = [];
  loadSpinner: boolean = true;
  @Input() biltiBillProcess: any = [];
  @Output() refreshList = new EventEmitter<void>();
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
          if (result === 'save') {
            this.router.navigate(['transaction/checkedMaterialsTeam']);
            this.refreshList.emit();
          }
        },
        (reason) => {}
      );
    }
}
