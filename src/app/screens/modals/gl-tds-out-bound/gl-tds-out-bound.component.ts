import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gl-tds-out-bound',
  templateUrl: './gl-tds-out-bound.component.html',
  styleUrl: './gl-tds-out-bound.component.scss'
})
export class GlTdsOutBoundComponent {

  
  @Input() reportData: any = [];

  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(): void {
    
  }

}
