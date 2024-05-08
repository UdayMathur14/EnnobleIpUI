import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dispatch-note',
  standalone: true,
  imports: [],
  templateUrl: './dispatch-note.component.html',
  styleUrl: './dispatch-note.component.scss'
})
export class DispatchNoteModelComponent {

  @Input() dispatch: any;

  constructor(public activeModal: NgbActiveModal){}

  ngOnInit(){
    console.log(this.dispatch);
  }
}
