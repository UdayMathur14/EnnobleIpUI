import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { APIConstant } from '../../../core/constants';
import { DispatchNoteService } from '../../../core/service/dispatch-note.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-bilti-rb-txn-data',
  templateUrl: './bilti-rb-txn-data.component.html',
  styleUrl: './bilti-rb-txn-data.component.scss',
})
export class BiltiRbTxnDataComponent implements OnInit {
  dispatchNotes:  any = [];
  count = Number.MAX_VALUE;
  @Input() biltiTransactionType: any;
  @Input() dispatchNoteId: any;
  @Input() selectedTransactionTypeCode: any
  filters: any = [];
  dispatchNumber: string = '';

  constructor(public activeModal: NgbActiveModal,
    private dispatchNoteService: DispatchNoteService
  ){}

  ngOnInit(): void {
    this.getDispatchData();
  }

  getDispatchData(offset: number = 0, count: number = this.count) {
    const data = {
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "dispatchNumber": this.dispatchNumber || "",
      "status": "",
      "frlrNumber": ""
    }

    this.dispatchNoteService.getDispatchNote(data, offset, count).subscribe((res: any) => {
      const patchedData = this.dispatchNoteId.map((item: any) => item.dispatchNoteId);
      if(this.biltiTransactionType == 'RB' || this.selectedTransactionTypeCode == 'RB'){
        this.dispatchNotes = res?.dispatchNotes?.filter((note: any) => note?.frlrNumber === null 
      &&  !patchedData?.includes(note?.id)  && note?.openFlag === 'Open');
      } else {
        this.dispatchNotes = res.dispatchNotes.filter((note: any) => 
          !patchedData?.includes(note?.id) &&  note?.openFlag === 'Open'
        );
        this.filters = res?.filters
      }

      
    })
  }

  getSelectedDispatchNotes() {
    return this.dispatchNotes.filter((note: any) => note?.selected);
  }

  onSavePress() {
    const selectedNotes = this.getSelectedDispatchNotes();
    this.activeModal.close(selectedNotes);

  }
  onClearFilter() {
    this.dispatchNumber = '';
    this.getDispatchData();
  }
}
