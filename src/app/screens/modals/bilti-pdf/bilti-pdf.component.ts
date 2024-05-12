import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bilti-pdf',
  templateUrl: './bilti-pdf.component.html',
  styleUrl: './bilti-pdf.component.scss'
})
export class BiltiPdfModalComponent implements OnInit {

  modalRef!: NgbModalRef;

  constructor(private activeModal: NgbActiveModal){}
  @Input() biltiData: any;

  ngOnInit(): void {

  }

  onClose(){
    this.activeModal.close();
  }

  
}
