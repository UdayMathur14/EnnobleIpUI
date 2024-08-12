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
  @Input() biltiTransactionType: any;
  filters: any = [];
  dispatchNumber: string = ''

  constructor(public activeModal: NgbActiveModal,
    private dispatchNoteService: DispatchNoteService
  ){}

  ngOnInit(): void {
    console.log(this.biltiTransactionType);
    
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
      if(this.biltiTransactionType == 'RB'){
      res.filters((item: any) => item.frlrNumber == 'null')
      }
      this.dispatchNotes = res.dispatchNotes;
      this.filters = res?.filters
      console.log(this.filters);
      
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
