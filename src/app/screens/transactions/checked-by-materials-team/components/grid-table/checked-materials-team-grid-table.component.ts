import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CheckedMaterialTeamModalComponent } from '../../../../modals/checked-material-team/checked-material-team.component';

@Component({
  selector: 'app-checked-materials-team-grid-table',
  templateUrl: './checked-materials-team-grid-table.component.html',
  styleUrl: './checked-materials-team-grid-table.component.scss'
})
export class CheckedMaterialsTeamGridTableComponent {
  constructor(private router: Router,
    private modalService: NgbModal) {}

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
}
