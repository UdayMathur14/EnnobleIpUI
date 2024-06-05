import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bilti-pdf',
  templateUrl: './bilti-pdf.component.html',
  styleUrl: './bilti-pdf.component.scss'
})
export class BiltiPdfModalComponent implements OnInit {

  modalRef!: NgbModalRef;
  @Input() biltiData: any;

  constructor(private activeModal: NgbActiveModal){}

  ngOnInit(): void {

  }

  onClose(){
    this.activeModal.close();
  }

  
}
