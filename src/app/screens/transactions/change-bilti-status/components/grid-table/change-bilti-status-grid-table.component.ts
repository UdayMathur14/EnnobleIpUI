import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChangeBiltiStatusModalComponent } from '../../../../modals/change-bilti-status/change-bilti-status.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-bilti-status-grid-table',
  templateUrl: './change-bilti-status-grid-table.component.html',
  styleUrl: './change-bilti-status-grid-table.component.scss'
})
export class ChangeBiltiStatusGridTableComponent implements OnInit {
  biltiBillProcessList: any = [];
  loadSpinner: boolean = true;
  @Input() biltiBillProcess: any = [];

  constructor(private modalService: NgbModal){

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
}
