import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APIConstant } from '../../../core/constants';
import { DispatchNoteService } from '../../../core/service/dispatch-note.service';

@Component({
  selector: 'app-bilti-rb-txn-data',
  templateUrl: './bilti-rb-txn-data.component.html',
  styleUrl: './bilti-rb-txn-data.component.scss'
})
export class BiltiRbTxnDataComponent implements OnInit {
  dispatchNotes:  any = [];
  count = Number.MAX_VALUE;

  constructor(public activeModal: NgbActiveModal,
    private dispatchNoteService: DispatchNoteService
  ){}

  ngOnInit(): void {
    this.getDispatchData();
  }

  getDispatchData(offset: number = 0, count: number = this.count) {
    const data = {
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "dispatchNumber": "",
      "status": "",
      "frlrNumber": ""
    }

    this.dispatchNoteService.getDispatchNote(data, offset, count).subscribe((res: any) => {
      this.dispatchNotes = res.dispatchNotes;
    })
  }

  getSelectedDispatchNotes() {
    return this.dispatchNotes.filter((note: any) => note.selected);
  }

  onSavePress() {
    const selectedNotes = this.getSelectedDispatchNotes();
    this.activeModal.close(selectedNotes);

  }
}
