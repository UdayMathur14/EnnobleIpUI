import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bilti-process-details-modal',
  templateUrl: './bilti-process-details.component.html',
  styleUrl: './bilti-process-details.component.scss'
})
export class BiltiProcessDetailsModalComponent implements OnInit{
  @Input() biltiProcess: any;
  constructor(public activeModal: NgbActiveModal){}
  ngOnInit(): void {
    console.log(this.biltiProcess, "modal data");
    
  }

}
