import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gl-taxation-out-bound',
  templateUrl: './gl-taxation-out-bound.component.html',
  styleUrl: './gl-taxation-out-bound.component.scss'
})
export class GlTaxationOutBoundComponent implements OnInit {

  @Input() reportData: any = [];

  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(): void {
    
  }

}
