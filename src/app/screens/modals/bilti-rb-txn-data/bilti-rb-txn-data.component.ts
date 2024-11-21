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
  @Input() selectedTransactionTypeCode: any;
  @Input() transporterCode: any;
  @Input() vendorCode: any;
  @Input() locationId: any;
  @Input() dispatchNo: any;
  filters: any = [];
  dispatchNumber: string = '';
  selectAll: boolean = false;

  constructor(public activeModal: NgbActiveModal,
    private dispatchNoteService: DispatchNoteService
  ){}

  ngOnInit(): void {
    this.getDispatchData();  
  }

  getDispatchData(offset: number = 0, count: number = this.count) {
    
    const data = {
      "locationIds": [this.locationId],
      "dispatchNumber": this.dispatchNumber || "",
      "status": "open",
      "frlrNumber": "",
      "transporterCode": this.transporterCode,
      "transporterName": "",
      "vendorCodes": this.vendorCode,
      "vendorNames": [],
    }

    this.dispatchNoteService.getDispatchNote(data, offset, count).subscribe((res: any) => {
      const documentRefNos = this.dispatchNo.map((item: any) => item.documentrefNo);
      this.dispatchNotes = res?.dispatchNotes.filter((item: any) => item?.frlrNumber == null && !documentRefNos.includes(item?.dispatchNumber))
    })
  }

  toggleSelectAll() {
    this.dispatchNotes.forEach((note: any) => (note.selected = this.selectAll));
  }
  
  checkIfAllSelected() {
    this.selectAll = this.dispatchNotes.every((note: any) => note.selected);
  }

  getSelectedDispatchNotes() {
    return this.dispatchNotes.filter((note: any) => note?.selected);
  }

  onSavePress() {
    const selectedNotes = this.getSelectedDispatchNotes();
    this.activeModal.close(selectedNotes.length ? selectedNotes : this.dispatchNotes);

  }
  onClearFilter() {
    this.dispatchNumber = '';
    this.getDispatchData();
  }
}
